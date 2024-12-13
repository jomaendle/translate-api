import { SidebarCloseIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAtom } from "jotai";
import { generatedFlashcardsHistory } from "@/services/flashcards.service.ts";
import { Button } from "@/components/ui/button.tsx";

interface FlashcardSidebarProps {
  onSelectCard?: (id: string) => void;
  currentCardId?: string;
  onClose?: () => void;
}

export function FlashcardSidebar({
  onSelectCard,
  currentCardId,
  onClose,
}: FlashcardSidebarProps) {
  const [flashcards] = useAtom(generatedFlashcardsHistory);

  return (
    <Sidebar variant="floating" className="">
      <SidebarHeader className="border-b px-2 py-4">
        <div className="flex items-center gap-2 px-2">
          <Button onClick={onClose} variant="ghost" size="icon">
            <SidebarCloseIcon className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Flashcards</span>
          <span className="ml-auto text-sm text-muted-foreground">
            {flashcards.length} cards
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {flashcards.map((card) => (
            <SidebarMenuItem key={card.id}>
              <SidebarMenuButton
                isActive={currentCardId === card.id}
                onClick={() => onSelectCard?.(card.id)}
                className="h-auto py-3"
              >
                <div className="flex flex-col gap-1 text-left">
                  <span className="font-medium">{card.front}</span>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {card.back}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
