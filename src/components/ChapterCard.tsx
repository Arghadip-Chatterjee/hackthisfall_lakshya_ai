"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useCallback, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const addChapterIdToSet = useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet();
      }
    }, [chapter.videoId, addChapterIdToSet]);

    const triggerLoad = async () => {
      if (chapter.videoId) {
        addChapterIdToSet();
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        console.log(response)

        setSuccess(true);
        addChapterIdToSet();
      } catch (error) {
        console.error(error);
        setSuccess(false);
        // Handle error message or toast here
        addChapterIdToSet();
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (isLoading) return; // Prevent triggering multiple times
      triggerLoad();
    }, []);

    useImperativeHandle(ref, () => ({
      triggerLoad,
    }));

    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {isLoading && <Loader2 className="animate-spin" />}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
