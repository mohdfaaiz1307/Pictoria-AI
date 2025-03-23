'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Tables } from '@datatypes.types'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { User } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import { checkoutWithStripe, createStripePortal } from '@/lib/stripe/server'
import { getErrorRedirect } from '@/lib/helpers'
import { getStripe } from '@/lib/stripe/client'
import { toast } from 'sonner'

type Product = Tables<"products">
type Price = Tables<"prices">
type Subscription = Tables<"subscriptions">

interface ProductWithPrices extends Product{
    prices: Price[]
}

interface PriceWithProduct extends Price{
    products: Product | null
}

interface SubscriptionWithProduct extends Subscription{
    prices: PriceWithProduct | null
}

interface PricingProps{
    subscription: SubscriptionWithProduct | null,
    user: User | null,
    products: ProductWithPrices[] | null,
    mostPopularProduct?: string,
    showInterval?: boolean,
    className?: string,
    activeProduct?: string,
}

const renderPricingButton =({
    subscription, user, product, price, mostPopularProduct, handleStripeCheckout, handleStripePortalRequest
}: {

    subscription: SubscriptionWithProduct | null;
    user: User | null;
    product: ProductWithPrices;
    price: Price, mostPopularProduct: string;
    handleStripeCheckout: (price: Price) => Promise<void>;
    handleStripePortalRequest: () => Promise<void>;


}) => {

    // case 1: user has active subscription for this product
    if(user && subscription && subscription.prices?.products?.name?.toLowerCase() === product.name?.toLowerCase()){
        return (
            <Button className='mt-8 w-full font-semibold'
             
            onClick={handleStripePortalRequest}>
                Manage Subscription
            </Button>
        )
    }

    // case 2: user is logged in and has an active subscription for a different product 
    if(user && subscription){
        return(
            <Button className='mt-8 w-full font-semibold'
            variant={"secondary"} 
            onClick={() => handleStripePortalRequest}>
                Switch Plan
            </Button>
        )
    }

    // case 3: logged in user with no subscription or different subscriptions

    if(user && !subscription){
        return(
            <Button className='mt-8 w-full font-semibold'
            variant={product.name?.toLowerCase() === mostPopularProduct.toLowerCase() ? "default" : "secondary"} 
            onClick={() => handleStripeCheckout(price)}>
                Subscribe
            </Button>
        )
    }
    return <Button className='mt-8 w-full font-semibold'
    variant={product.name?.toLowerCase() === mostPopularProduct.toLowerCase() ? "default" : "secondary"} 
    onClick={() => handleStripeCheckout(price)}>
        Subscribe
    </Button>

    return null;
}

const Pricing = ({
    user,
    products,
    mostPopularProduct = "" ,
    subscription,
    showInterval = true,
    className,
    activeProduct = ""
}: PricingProps) => {
    const [billingInterval, setBillingInterval]= useState("month");
    const router = useRouter();
    const currentPath = usePathname()

    console.log(subscription,products);

    const handleStripeCheckout = async (price: Price) => {
        //console.log("Handle stripe checkout function: ", price)

        if(!user){
            return router.push("/login")
        }

        const {errorRedirect, sessionId} = await checkoutWithStripe(price, currentPath);

        if(errorRedirect){
            return router.push(errorRedirect)
        }

        if(!sessionId){
            return router.push(getErrorRedirect(
                currentPath, "An unknown error occured", "Please try again later or contact us."
            ))
        }

        const stripe = await getStripe();
        stripe?.redirectToCheckout({sessionId})
    }

    const handleStripePortalRequest = async () => {
        toast.info("Redirecting to stripe portal...")
        const redirectUrl = await createStripePortal(currentPath);
        return router.push(redirectUrl)
    }

  return (
    <section className={cn('max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full flex flex-col', className)}>
        {showInterval
        &&
        <div className='flex justify-center items-center space-x-4 py-8'>
        <Label htmlFor="pricing-switch" className='font-semibold text-base'>
            Monthly
        </Label>
        <Switch id="pricing-switch"
        checked={billingInterval === "year"}
        onCheckedChange={(checked) => setBillingInterval(checked ? "year" : "month")}
        />
        <Label htmlFor="pricing-switch" className='font-semibold text-base'>
            Yearly
        </Label>
    </div>
        }


            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 place-items-center mx-auto gap-8 space-y-0'>
                {
                    products?.map(product => {
                        const price = product?.prices?.find(price => price.interval === billingInterval)
                        if(!price) return null;

                        const priceString = new Intl.NumberFormat("en-US",{
                            style: "currency",
                            currency: price.currency!,
                            minimumFractionDigits: 0,
                        }).format((price?.unit_amount || 0)/100)

                        return <div key={product.id} className={cn('border bg-background rounded-xl shadow-sm h-fit divide-y divide-border',
                            product.name?.toLowerCase() === activeProduct.toLowerCase() ? "border-primary bg-background drop-shadow-md" 
                            : "border-border" 
                        )}>
                            <div className='p-6'>
                                <h2 className='text-2xl leading-6 font-semibold text-foreground flex items-center justify-between'>
                                    {product.name}

                                    {
                                        product.name?.toLowerCase() === activeProduct.toLowerCase() ? <Badge className='border-border font-semibold'>
                                            Selected
                                        </Badge> : null
                                    }

                                    {
                                        product.name?.toLowerCase() === mostPopularProduct.toLowerCase() ? <Badge className='border-border font-semibold'>
                                            Most Popular
                                        </Badge> : null
                                    }
                                </h2>
                                <p className='text-muted-foreground mt-4 text-sm'>
                                    {product.description}
                                </p>
                                <p className='mt-8'>
                                    <span className='text-4xl font-extrabold text-foreground'>{priceString}</span>
                                    <span className='text-base font-medium text-muted-foreground'>/{billingInterval}</span>
                                </p>
                                {
                                    renderPricingButton({subscription, user, product, price, mostPopularProduct, handleStripeCheckout, handleStripePortalRequest})
                                }
                            </div>
                    </div>
})}
            </div>
    </section>


  )
}

export default Pricing