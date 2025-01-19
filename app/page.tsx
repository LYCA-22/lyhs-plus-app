"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent className="size-11/12 w-full">
          <DrawerHeader>
            <DrawerTitle>帳號登入</DrawerTitle>
            <DrawerDescription>一組帳號，暢通無阻</DrawerDescription>
          </DrawerHeader>
          <div className="grow">
            <iframe
              className="w-full grow h-full"
              src="https://auth.lyhsca.org/account/login?type=app"
            ></iframe>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
