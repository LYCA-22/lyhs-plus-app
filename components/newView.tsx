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
        <button className="flex gap-1 p-2 px-4 border border-borderColor w-fit rounded-full mt-2 hover:bg-hoverbg">
          <div className="opacity-50 flex items-center gap-2 font-medium">
            {icons["eye"]()}
            查看
          </div>
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
