import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useCountryLeaderboardQuery, useGlobalLeaderboardQuery } from '@/apis/leaderboard/user'
import { useSelect } from '@/hooks/useSelect'
import { LeaderboardList } from "./components/LeaderboardList"
import LoadingDots from "@/components/LoadingDots"
import ErrorPage from "@/components/ErrorPage"
import { Button } from "@/components/ui/button"
import { countryMap, getCountryCode } from "@/utils/countryMap"
import { Label } from "@/components/ui/label"
import { useUpdateProfileMutation } from '@/apis/auth-user/profile/user'
import { toast } from "sonner"
import { useAuthActions } from '@/hooks/useDispatch';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("global");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [updateProfile] = useUpdateProfileMutation()
  const { user } = useSelect();
  const { updateUser } = useAuthActions();
  const { data: leaderboardData, error, isLoading } = useGlobalLeaderboardQuery({ k : 10 });
  const { 
    data: countryLeaderboardData, 
    error: countryError, 
    isLoading: isCountryLoading 
  } = useCountryLeaderboardQuery({ k : 10, country : user.details?.country!});
  
  if(error || countryError) <ErrorPage/>

  const handleSaveCountry = async () => {
    const data = new FormData();
      if (!selectedCountry) {
        return
      }
      data.append("country", getCountryCode(selectedCountry));
      const toastId = toast.loading('Processing...');
      try {
        const updatedCountry = await updateProfile(data).unwrap();
        toast.success('Country updated in profile successfully',{
          className : 'success-toast',
          id : toastId
        })
        console.log(updatedCountry.data);
        updateUser({ ...updatedCountry.data });
        setOpenDialog(false)
      } catch (error : any) {
        const apiErrors = error?.data?.error
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          toast.dismiss(toastId);
          apiErrors.forEach((e: any) => {
            toast.error(`field : ${e.field}`, {
              description: `Error : ${e.message}`,
            })
          })
        }
          toast.error('Error',{
              className : 'error-toast',
              id : toastId,
              description : error?.data?.message
          })
    }
  }


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
              {/* GLOBAL LEADERBOARD */}
              <TabsContent value="global" className="space-y-4 mt-6">
                {isLoading ?
                  <LoadingDots/>
                : <LeaderboardList
                  data={leaderboardData?.data?.users ?? []}
                />}
              </TabsContent>
              {/* COUNTRY LEADERBOARD */}
              <TabsContent value="country" className="space-y-4 mt-6">
                { isCountryLoading ?
                  <LoadingDots/>
                : countryLeaderboardData?.data ? <LeaderboardList
                  data={countryLeaderboardData?.data?.users ?? []}
                />
                : (
                <Dialog
                  open={openDialog}
                  onOpenChange={(open) => setOpenDialog(open)} 
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setOpenDialog(true)}>
                      Add Your Country
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Your Country</DialogTitle>
                      <DialogDescription>
                        Select your country to see local rankings and compete with nearby coders.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                      <Label htmlFor="country">Country</Label>
                      <Select onValueChange={(value) => setSelectedCountry(value)}>
                        <SelectTrigger id="country" className="w-full">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>

                        {/* scrollable dropdown */}
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {Object.values(countryMap).map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveCountry} disabled={!selectedCountry}>
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                )
              }
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
