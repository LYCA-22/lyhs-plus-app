export function UserTerms() {
  return (
    <div className="space-y-4 h-[450px] overflow-y-auto p-5 bg-sky-50 dark:bg-sky-300/10 rounded-2xl">
      <h2 className="text-xl font-medium">KSA 服務使用者條款</h2>
      <p className="text-right">最後更新日期：115年02月10日</p>
      <p>
        歡迎您使用「KSA 服務」（以下簡稱本服務）。本服務由 LYHS Plus
        平台提供，旨在協助使用者整合及存取校務行政系統相關資訊。當您註冊、啟用或使用本服務時，即表示您已閱讀、理解並同意遵守本條款之所有內容。
      </p>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">一、服務使用資格</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <p>本服務僅限符合下列條件之使用者使用：</p>
          <ol className="list-disc pl-5">
            <li>已註冊並登入 LYHS Plus 帳號之學生。</li>
            <li>已主動啟用 KSA 服務功能之使用者。</li>
          </ol>
        </li>
        <li>
          <p>
            若使用者不符合上述資格，LYHS Plus 有權限制或終止其使用本服務之權利。
          </p>
        </li>
      </ol>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">二、登入方式</h3>
      <p>本服務提供以下兩種登入方式： </p>
      <p>（一）快速登入</p>
      <p>使用者可選擇將校務行政系統帳號與密碼儲存在 LYHS Plus 系統中。</p>
      <ol className="list-disc pl-5">
        <li>使用者帳號將儲存於伺服器中。</li>
        <li>使用者密碼將採用可逆加密方式儲存。</li>
        <li>使用者可隨時取消或刪除儲存之登入資訊。</li>
      </ol>
      <p>（二）一般登入</p>
      <p>
        使用者可於使用服務時，透過網頁介面輸入校務行政系統帳號與密碼，並由系統代為進行登入作業。
      </p>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">三、資料蒐集與使用</h3>
      <p>
        當使用者登入本服務並使用相關功能時，本服務可能會向校務行政系統取得以下學生基本資料：
      </p>
      <ol className="list-decimal pl-7 space-y-2">
        <li>校務行政系統使用者 UID</li>
        <li>中文姓名</li>
        <li>學號、班級、座號</li>
        <li>目前就讀之學年與學期</li>
        <li>出生年月日</li>
        <li>身分證字號</li>
        <li>居住地址</li>
        <li>自傳</li>
        <li>教育局學生識別字號</li>
        <li>帳號建立時間與資料更新時間</li>
      </ol>
      <p>上述資料僅用於提供與優化本服務功能，不會用於未經授權之用途。</p>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">四、資料保護與資訊安全</h3>
      <p>LYHS Plus 重視使用者個人資料之安全，並採取下列措施：</p>
      <ol className="list-decimal pl-7 space-y-2">
        <li>
          <p>若使用快速登入功能：</p>
          <ol className="list-disc pl-5">
            <li>使用者帳號將以明文形式儲存於伺服器。</li>
            <li>使用者密碼將採用可逆加密方式儲存。</li>
          </ol>
        </li>
        <li>本服務僅於使用者主動操作相關功能時，才會連線至校務行政系統。</li>
        <li>
          <p>本服務僅作為資料傳輸與整合之橋樑：</p>
          <ol className="list-disc pl-5">
            <li>
              從校務行政系統取得之資料原則上不會長期儲存在伺服器或資料庫中。
            </li>
            <li>系統僅於必要期間暫時處理資料，以完成使用者請求之功能。</li>
          </ol>
        </li>
        <li>
          本服務將採取合理之資訊安全措施，以防止資料遭未授權存取、洩漏、竄改或毀損。
        </li>
      </ol>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">五、使用者責任</h3>
      <ol className="list-decimal pl-7 space-y-2">
        <li>使用者應妥善保管自身帳號與密碼，不得提供予他人使用。</li>
        <li>
          使用者不得利用本服務從事任何違反法律、學校規範或侵害他人權益之行為。
        </li>
        <li>若使用者發現帳號或資料可能遭未授權使用，應立即通知服務提供方。</li>
      </ol>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">六、服務限制與免責聲明</h3>
      <ol className="list-decimal pl-7 space-y-2">
        <li>本服務為輔助性整合工具，並非校務行政系統官方服務。</li>
        <li>
          若因校務行政系統維護、網路問題或其他不可抗力因素導致服務中斷，LYHS
          Plus 不保證服務可持續或即時提供。
        </li>
        <li>
          使用者應理解透過第三方系統存取資料可能存在風險，並自行評估是否使用本服務。
        </li>
      </ol>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">七、服務變更與終止</h3>
      <ol className="list-decimal pl-7 space-y-2">
        <li>LYHS Plus 保留隨時修改、暫停或終止本服務之權利。</li>
        <li>若條款內容有重大變更，將透過平台公告或適當方式通知使用者。</li>
        <li>使用者於條款更新後繼續使用本服務，即視為同意修訂內容。</li>
      </ol>
      <div
        aria-label="line"
        className="w-full h-[1px] dark:bg-zinc-600 bg-zinc-300"
      ></div>
      <h3 className="font-medium text-lg">八、條款同意</h3>
      <p>當使用者啟用或使用本服務時，即表示使用者已閱讀並同意本條款內容。</p>
    </div>
  );
}
