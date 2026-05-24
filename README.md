# QuickSign

QuickSign 是一個純前端、Mobile-first 的簽收／即場登記（Walk-in 登記）系統。

## 功能

- 建立簽收／即場登記項目
- 選擇簽收項目
- 啟動簽到模式
- 簽到模式鎖定，只能簽收
- 退出簽到模式需輸入管理密碼
- 自訂收集欄位，例如電話、電郵、會員編號
- 電子簽名
- 自動生成簽收表／即場登記表
- 顯示日期、時間、姓名、自訂欄位及簽名
- 一鍵預覽
- 匯出 PNG
- 匯出 PDF
- Web Share API 分享圖片
- 設定機構／用戶名稱
- 更改管理密碼
- localStorage 儲存資料
- 可部署到 GitHub Pages / Vercel

## 安裝

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel

直接將整個資料夾上載到 GitHub，再在 Vercel Import Project。

## GitHub Pages

```bash
npm run build
```

將 `dist` 內容部署到 GitHub Pages。
