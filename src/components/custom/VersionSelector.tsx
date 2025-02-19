import { useNavigate, useParams } from "react-router"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BibleBookStub, BibleVersion, BibleVersionsQuery } from "@/graphql/__generated__/graphql"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"

export function VersionSelector({ versions }: { versions: BibleVersionsQuery | undefined }) {
    const params = useParams()
    const navigate = useNavigate()
    const [version, setVersion] = useState<BibleVersion | undefined>(undefined)
    const [book, setBook] = useState<BibleBookStub | undefined>(undefined)
    useEffect(() => {
        if (versions) {
            const found = versions?.bibleVersions?.find((version) => version?.id.toLowerCase() === params.version) as BibleVersion
            setVersion(found)
        }
    }, [params.version, versions])

    useEffect(() => {
        if (version) {
            setBook(version?.books?.find((book) => book?.code?.toLowerCase() === params.book) as BibleBookStub)
        }
    }, [version])

      return (
        <div className="space-x-2">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              {version ? <span>{version?.name}</span> : <Skeleton className="h-4 w-[150px]" />}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="h-[500px] overflow-scroll" align="end">
            {versions?.bibleVersions?.map((version) => (
              <DropdownMenuCheckboxItem 
              key={version?.id} 
              checked={version?.id.toLowerCase() === params.version}
               onCheckedChange={() => {
                setVersion(version as BibleVersion)
                navigate(`/${version?.id.toLowerCase()}/${params.book}`)
               }}
               >
                <span>{version?.name}</span>
                <span className="ml-auto">{version?.displayAbbreviation}</span>
                </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
            {book ? <span>{book?.shortName}</span> : <Skeleton className="h-4 w-[70px]" />}

              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="h-[500px] overflow-scroll" align="end">
            {version?.books?.map((book) => (
              <DropdownMenuCheckboxItem 
              key={book?.id} 
              checked={book?.code?.toLowerCase() === params.book}
               onCheckedChange={() => {
                setBook(book as BibleBookStub)
                navigate(`/${params.version}/${book?.code?.toLowerCase()}`)
               }}
               >
                <span>{book?.shortName}</span>
                </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
    
  }