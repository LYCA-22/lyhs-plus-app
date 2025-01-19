import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

export function LoginPage({ children }: { children: React.ReactNode }) {
  const LoginUrl = "https://auth.lyhsca.org/account/login?type=app";

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="size-11/12 w-full">
        <DrawerHeader className="flex justify-between">
          <div>
            <DrawerTitle>帳號登入</DrawerTitle>
            <DrawerDescription>一組帳號，暢通無阻</DrawerDescription>
          </div>
          <DrawerClose className="bg-rootBg flex font-medium p-2 px-4 rounded-full hover:bg-foreground hover:text-background transition-all">
            關閉
          </DrawerClose>
        </DrawerHeader>
        <div className="grow">
          <iframe className="w-full grow h-full" src={LoginUrl}></iframe>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
