import {
    Dialog as DialogPrimitive,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useContext } from "react"
import { AppContext } from "@/App"
import { DataTable } from "./DataTable"
import { createVerseColumns } from "../utils/columns"

export function Dialog({ children }: { children: React.ReactNode }) {
    const { chapter } = useContext(AppContext)
    return (
        <DialogPrimitive>
            <div>
                {children}
                <DialogContent className="sm:max-w-[80vw] h-[800px">
                    <DialogHeader>
                        <DialogTitle>{chapter?.name}</DialogTitle>
                        <DialogDescription>
                            View verse specific usx tags
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <DataTable 
                        data={chapter?.metadata ?? []} 
                        columns={createVerseColumns()} 
                        filter="verses"
                        showSearch
                        showPaginator
                    />
                    </div>
                    <DialogFooter>
                        {/* <Button variant="ghost">Cancel</Button> */}
                    </DialogFooter>
                </DialogContent>
            </div>
        </DialogPrimitive>
    )
}