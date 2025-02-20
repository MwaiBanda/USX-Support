
export type Chapter = {
    id: string
    name: string
    status: "supported" | "unsupported"
    tags: string
    unsupportedTags: string
    metadata: VerseMetadata[]
}

export type VerseMetadata = {
    id: string
    name: string
    status: "supported" | "unsupported"
    unsupportedTags: string
    tags: string
}
