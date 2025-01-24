import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { icons } from "./icons";

export function NewView({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex gap-1 p-2 px-3 w-fit rounded-full mt-2 bg-transparent relative group -translate-x-3">
          <div className="opacity-50 flex items-center gap-1 font-normal text-sm z-20">
            {icons["eye"]()}
            詳細資訊
          </div>
          <div className="absolute w-full h-full bg-hoverbg scale-75 z-10 opacity-0 top-0 right-0 rounded-full transition-all group-hover:opacity-100 group-hover:scale-100 group-active:bg-buttonBg"></div>
        </button>
      </DrawerTrigger>
      <DrawerContent className="size-11/12 w-full">
        <DrawerHeader className="flex justify-between">
          <div>
            <DrawerTitle>公告查閱</DrawerTitle>
            <DrawerDescription>高雄市立林園高級中學</DrawerDescription>
          </div>
          <DrawerClose className="bg-rootBg flex font-medium p-2 px-4 rounded-full hover:bg-foreground hover:text-background transition-all">
            關閉
          </DrawerClose>
        </DrawerHeader>
        <div className="grow">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
