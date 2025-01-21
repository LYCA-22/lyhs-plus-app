import { type MouseEvent } from "react";
import { icons } from "./icons";

export function SchoolSystem() {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const left = window.innerWidth - width;
    const top = window.innerHeight - height;

    const newWindow = window.open(
      "about:blank",
      "schoolSystem",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (newWindow) {
      newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>校務行政系統</title>
              </head>
              <body style="margin:0;padding:0;">
                <form id="redirectForm" method="post" action="https://highschool.kh.edu.tw/OpenIdLogin.action">
                  <input type="hidden" name="school" value="124311D">
                </form>
                <script>
                  document.getElementById('redirectForm').submit();
                </script>
              </body>
            </html>
          `);
    }
  };
  return (
    <button
      className="min-w-fit p-2 px-3 bg-foreground text-background flex justify-center items-center rounded-[40px] rounded-bl-xl transition-all m-1 hover:opacity-70 active:scale-95"
      onClick={handleClick}
    >
      <div className="m-1">{icons["schoolSystem"]()}</div>
      <p className="mx-1 p-0 font-medium text-md">校務行政系統</p>
    </button>
  );
}
