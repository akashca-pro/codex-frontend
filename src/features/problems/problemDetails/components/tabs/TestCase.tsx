import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Trash,
} from "lucide-react"
import { cn } from "@/lib/utils";
import type { ITestCase } from "@/types/problem-api-types/fieldTypes";

interface TestCaseProps {
  cases: ITestCase[];
  activeCaseIndex: number;
  setActiveCaseIndex: (index: number) => void;
  handleAddCase: () => void;
  handleRemoveCase: (index: number) => void;
  updateActiveCase: (updates: Partial<{ input: string; output: string }>) => void;
}


const TestCase = (props : TestCaseProps) => {
  return (
    <div>
        <div className="flex items-center justify-between gap-2">
            <ScrollArea className="w-full">
            <div className="flex items-center gap-2 pb-2">
                {props.cases.map((tc, i) => (
                <button
                    key={tc.Id}
                    onClick={() => props.setActiveCaseIndex(i)}
                    className={cn(
                    "group inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                    i === props.activeCaseIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 hover:bg-muted border-border",
                    )}
                >
                    {"Case " + (i + 1)}
                    <Trash
                    className={cn(
                        "ml-2 h-3.5 w-3.5 opacity-50 hover:opacity-100 transition",
                        props.cases.length === 1 && "hidden",
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        props.handleRemoveCase(i)
                    }}
                    />
                </button>
                ))}
            </div>
            </ScrollArea>

            <Button size="sm" variant="outline" onClick={props.handleAddCase} className="shrink-0 bg-transparent">
            <Plus className="h-4 w-4 mr-1" />
            Add test
            </Button>
        </div>

        {/* Active case editor fields */}
        {props.cases[props.activeCaseIndex] ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Input</div>
                <Textarea
                value={props.cases[props.activeCaseIndex].input}
                onChange={(e) => props.updateActiveCase({ input: e.target.value })}
                className="min-h-[120px] font-mono text-sm"
                placeholder="Enter function inputs, e.g. nums = [2,7,11,15], target = 9"
                />
            </div>
            <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Expected Output</div>
                <Textarea
                value={props.cases[props.activeCaseIndex].output}
                onChange={(e) => props.updateActiveCase({ output: e.target.value })}
                className="min-h-[120px] font-mono text-sm"
                placeholder="Enter expected output, e.g. [0,1]"
                />
            </div>
            </div>
        ) : (
            <div className="mt-6 text-sm text-muted-foreground">No testcases. Add one to get started.</div>
        )}
    </div>
  )
}

export default TestCase
