import { getCredits } from "@/app/actions/credit-actions";
import { getImages } from "@/app/actions/image-actions";
import { fetchModels } from "@/app/actions/model-actions";
import StatsCards from "@/components/dashboard/StatsCards";
import { createClient } from "@/lib/supabase/server"
import RecentImages from "@/components/dashboard/RecentImages";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentModels from "@/components/dashboard/RecentModels";


export default async function Page() {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser(); 

  const {data: models, count: modelCount} = await fetchModels();

  const {data: credits} = await getCredits();
  const {data: images} = await getImages();

  const imageCount = images?.length || 0;

  return (
      <section className="container mx-auto flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.user_metadata.full_name}
          </h2>
        </div>
        <StatsCards imageCount={imageCount}
        modelCount= {modelCount}
        credits = {credits}/>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-4 ">
          <RecentImages images={images?.slice(0, 6) ?? []}/>
          <div className="h-full col-span-full xl:col-span-1 gap-0 sm:gap-6 xl:gap-0 xl:space-y-6 flex flex-col sm:flex-row xl:flex-col space-y-6">
          <QuickActions/>

<RecentModels models={models ?? []} />
          </div>
        </div>

      </section>
  )
}
