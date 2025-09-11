import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Ban, Eye, Search } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import UserDetailsModal from "./components/UserDetailsModal";
import { useListUsersQuery, useToggleBlockUsersMutation } from '@/apis/auth-user/dashboard/admin/userManagement'
import { AppPagination } from "@/components/Pagination"
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import LoadingDots from "@/components/LoadingDots"
import CopyToClipboard from "@/components/CopyToClipboard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import MobileUserCard from "./components/MobileUserCard"

interface User {
    userId : string;
    username : string;
    email : string;
    firstName : string;
    lastName : string;
    avatar : string;
    country : string;
    preferredLanguage : string;
    isArchived : boolean;
    easySolved : number;
    mediumSolved : number;
    hardSolved : number;
    totalSubmission : number;
    streak : number;
    createdAt : string;
    updatedAt : string;
    isVerified : boolean;
    authProvider : string;
    isBlocked : boolean;
}

const UsersList = () => {
    const [page,setPage] = useState(1);
    const [limit] = useState(10);
    const [selectedUser, setSelectedUser] = useState< User | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [block, setBlock] = useState<boolean>(false);
    const [archived,setArchived] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(true);
    const [sort, setSort] = useState<string>('latest');
    const [authProvider, setAuthProvider] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggleBlock] = useToggleBlockUsersMutation();
    const { data } = useListUsersQuery({
        page,
        limit,
        authProvider : authProvider === 'all' ? undefined : authProvider,
        isVerified : verified,
        isArchived : archived,
        isBlocked : block,
        search : searchTerm,
        sort
    });
    const getStatusBadge = (user: User) => {
        if (user.isBlocked) return <Badge className="bg-red-500">Blocked</Badge>
        if (user.isArchived) return <Badge className="bg-yellow-500">Archived</Badge>
        if (user.isVerified) return <Badge className="bg-green-500">Active</Badge>
        return <Badge variant="secondary">Unverified</Badge>
    }

    const handleViewDetails = (user: User) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleBlockUser = async (user: User) => {
        const payload = user.isBlocked 
        ? { userId : user.userId, block : false } 
        : { userId : user.userId, block : true };
        const toastId = toast.loading('Processing...');
        try {
            await toggleBlock(payload).unwrap();
            toast.success(`User ${user.firstName} is ${payload.block ? 'blocked' : 'unblocked'} successfully`,{
                className : 'success-toast',
                id : toastId
            })
        } catch (error : any) {
            if(error?.data?.error.length !== 0){
                toast.dismiss(toastId);
                error.data.error.map(e=>{
                    toast.error(`field : ${e.field}`,{
                    description : `Error : ${e.message}`
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
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center justify-between"
    >
    {/* Left side: Heading + Badge */}
    <div>
        <h1 className="text-2xl sm:text-3xl font-bold pb-1">User management</h1>
    </div>
    </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by username, email, firstname or lastname"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
        <Label htmlFor="block-switch">Blocked</Label>
        <Switch
            id="blocked-switch"
            checked={block}
            onCheckedChange={setBlock}
        />
        </div>
        <div className="flex items-center space-x-2">
        <Label htmlFor="archived-switch">Archived</Label>
        <Switch
            id="archived-switch"
            checked={archived}
            onCheckedChange={setArchived}
        />
        </div>
        <div className="flex items-center space-x-2">
        <Label htmlFor="verified-switch">Verified</Label>
        <Switch
            id="verified-switch"
            checked={verified}
            onCheckedChange={setVerified}
        />
        </div>

        {/* Sort */}
        <Select value={sort} onValueChange={setSort} >
          <SelectTrigger>
            <SelectValue placeholder='Sort'/>
          </SelectTrigger>
          <SelectContent className="border-none">
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select> 

        {/* AuthProvider */}
        <Select value={authProvider} onValueChange={setAuthProvider} >
          <SelectTrigger>
            <SelectValue placeholder='AuthProvider'/>
          </SelectTrigger>
          <SelectContent className="border-none">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="LOCAL">LocalAuth</SelectItem>
            <SelectItem value="GOOGLE">GoogleAuth</SelectItem>
          </SelectContent>
        </Select> 

      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-lg sm:text-xl">Total Users ({data?.data.users.length})</CardTitle>
          </CardHeader>

          <CardContent className="p-1">
            {/* Desktop Table */}
            <div className="hidden sm:block">
                {data ? <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Auth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data.users.map((user, index) => (
                    <motion.tr
                        key={user.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/50 transition-colors"
                    >
                        <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>

                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                            <AvatarImage src={getCloudinaryUrl(user.avatar)} alt={user.username} />
                            <AvatarFallback className="text-xs">
                                {user.firstName[0]}
                                {user.lastName[0]}
                            </AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-sm text-muted-foreground">
                                {user.firstName} {user.lastName}
                            </p>
                            </div>
                        </div>
                        </TableCell>

                        <TableCell>
                        <div className="flex items-center gap-2">
                            <p className="text-sm truncate">{user.email}</p>
                            <CopyToClipboard text={user.email} label="Email" />
                        </div>
                        </TableCell>

                        <TableCell>
                        <Badge variant={user.authProvider === "GOOGLE" ? "default" : "secondary"}>
                            {user.authProvider}
                        </Badge>
                        </TableCell>

                        <TableCell>{getStatusBadge(user)}</TableCell>

                        <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)} className="h-8">
                            <Eye className="w-4 h-4 mr-1" />
                            More
                            </Button>
                            {/* Toggle Block */}

                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Button
                                    onClick={() => handleBlockUser(user)}
                                    className={`h-8 ${
                                    user.isBlocked
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                >
                                    {user.isBlocked ? (
                                    <>
                                        <Ban className="w-4 h-4 mr-1" />
                                        Blocked
                                    </>
                                    ) : (
                                    <>
                                        Block
                                    </>
                                    )}
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                {user.isBlocked ? "Click to unblock user" : "Click to block user"}
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>

                        </div>
                        </TableCell>
                    </motion.tr>
                    ))}
                </TableBody>
                </Table> 
                :  <LoadingDots/>}
            </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
            {data ? (
            data.data.users.map((user) => (
                <MobileUserCard
                key={user.userId}
                user={user}
                onView={() => handleViewDetails(user)}
                onBlock={() => handleBlockUser(user)}
                />
            ))
            ) : (
            <LoadingDots />
            )}
        </div>

            {data?.data.users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {data?.data.totalItems! >= 10 && (
        <AppPagination 
          page={data?.data.currentPage!}
          totalPages={data?.data.totalPage || 0}
          onPageChange={(newPage)=>setPage(newPage)}  
        />
      )}

      {/* User Details Modal (Desktop) */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
      />      

    </div>
  )
}

export default UsersList
