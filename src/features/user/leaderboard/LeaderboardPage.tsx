import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCountryLeaderboardQuery, useGlobalLeaderboardQuery } from '@/apis/leaderboard/user'
import { useSelect } from '@/hooks/useSelect'
import { LeaderboardList } from "./components/LeaderboardList"
import LoadingDots from "@/components/LoadingDots"
import ErrorPage from "@/components/ErrorPage"

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("global")
  const { user } = useSelect();
  const { data: leaderboardData, error, isLoading } = useGlobalLeaderboardQuery({ k : 10 });
  console.log(leaderboardData)
  const { data: countryLeaderboardData, error: countryError, isLoading: isCountryLoading } = useCountryLeaderboardQuery({ k : 10, country : user.details?.country!});

  if(error || countryError) <ErrorPage/>

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other coders worldwide.</p>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="country">Country</TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="space-y-4 mt-6">
                {isLoading ?
                  <LoadingDots/>
                : <LeaderboardList
                  data={leaderboardData?.data?.users ?? []}
                />}
              </TabsContent>

              <TabsContent value="country" className="space-y-4 mt-6">
                { isCountryLoading ?
                  <LoadingDots/>
                : <LeaderboardList
                  data={countryLeaderboardData?.data?.users ?? []}
                />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
