import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search} from "lucide-react"
import { usePublicListProblemsQuery } from '@/apis/problem/public'
import { DifficultyMap } from "@/mappers/problem"
import { AppPagination } from "@/components/Pagination"
import Navbar from "@/components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Problems() {
  const navigate = useNavigate();
  const [page,setPage] = useState(1);
  const [limit] = useState(10);
  const [sort,setSort] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const { data } = usePublicListProblemsQuery({
    page,
    difficulty : difficultyFilter === 'all' ? undefined : difficultyFilter,
    limit,
    search : searchTerm,
    sort,
  });

  const ProblemList = useMemo(()=>{
    const problems = data?.data?.problems || []

    return problems.map(problem => ({
      Id : problem.Id,
      questionId : problem.questionId,
      title : problem.title,
      difficulty : DifficultyMap[problem.difficulty] || 'unknown',
      tags : problem.tags,
      updatedAt : problem.updatedAt,
      createdAt : problem.createdAt,
    }))

  },[data]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500"
      case "Medium":
        return "text-yellow-500"
      case "Hard":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
  <div className="flex flex-col h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl sm:text-3xl font-bold">Problems</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Practice coding problems to improve your skills.
            </p>
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
                placeholder="Search problems by tag, title, or question ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="border-none">
                <SelectItem className="border-none focus:outline-none focus:ring-0 data-[highlighted]:outline-none data-[highlighted]:ring-0" value={'all'}>All Difficulties</SelectItem>
                <SelectItem value="Easy" className="text-green-400 focus:outline-none focus:ring-0 data-[highlighted]:bg-green-900 data-[highlighted]:outline-none data-[highlighted]:ring-0" >Easy</SelectItem>
                <SelectItem value="Medium" className="text-yellow-400 focus:outline-none focus:ring-0 data-[highlighted]:bg-yellow-600 data-[highlighted]:outline-none data-[highlighted]:ring-0">Medium</SelectItem>
                <SelectItem value="Hard" className="text-red-400 focus:outline-none focus:ring-0 data-[highlighted]:bg-red-900 data-[highlighted]:outline-none data-[highlighted]:ring-0" >Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort} >
              <SelectTrigger>
                <SelectValue placeholder='Sort'/>
              </SelectTrigger>
              <SelectContent className="border-none">
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Problems List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-lg sm:text-xl">
                  Problems ({ProblemList.length || 0})
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {ProblemList.map((problem, index) => (
                    <motion.div
                     onClick={()=>{navigate(`/problems/${problem.Id}`)}}
                      key={problem.Id}
                      className={`
                        flex flex-col sm:flex-row sm:items-center sm:justify-between 
                        gap-3 sm:gap-0 p-4 rounded-xl transition-colors cursor-pointer
                        outline-none ring-0 focus:outline-none focus:ring-0
                        ${index % 2 === 0 
                          ? "bg-background hover:bg-accent/70" 
                          : "bg-muted/50  hover:bg-accent/70"}
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        {/* ID + Title */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-muted-foreground text-xs sm:text-sm font-mono font-semibold">
                            {problem.questionId}.
                          </span>
                          <h2 className="font-bold truncate text-sm sm:text-base">
                            {problem.title}
                          </h2>
                        </div>

                        {/* Tags */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            {problem.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs font-semibold">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div className="flex items-center text-xs sm:text-sm font-bold">
                          <span className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {data?.data.totalItems! >= 10 && (
            <AppPagination 
              page={data?.data.currentPage!}
              totalPages={data?.data.totalPage || 0}
              onPageChange={(newPage)=>setPage(newPage)}  
            />
          )}
        </div>
      </main>
  </div>
  )
}
