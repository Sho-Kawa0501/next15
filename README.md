# 料理デリバリーデモアプリケーション

## アプリケーション概要
料理のデリバリーデモアプリケーションです。  
TypeScript、React.js、Next.js の学習成果を記録として残すために作成しました。

## テスト用ログインアカウント
- メールアドレス：`shinki1@test.com`
- パスワード：`testuser`

※アカウントを新規作成していただくことも可能です。  
※作成されたアカウントは管理者より、定期的に削除させていただきます。

## トップページ（ユーザーログインまたは新規登録後）
<img width="983" height="559" alt="Image" src="https://github.com/user-attachments/assets/26310700-b528-4bfb-aa6b-f11be3d957ad" />

- ①ユーザー情報モーダルの表示 
- ②住所検索モーダルの表示
- ③レストラン名検索
- ④カート情報モーダルの表示
- ⑤レストラン一覧のうち、選択したカテゴリーだけを表示
- ⑥レストラン個別ページに遷移

## 使用技術
| カテゴリー           | 名称                                                       |
| ------------------ | ---------------------------------------------------------- |
| フロントエンド       | TypeScript / React.js / Next.js                           |
| ホスティング        | Vercel                                                    |
| インフラ（AWS）      | S3 / CloudFront / Route53                                 |
| インフラ（IaC）      | Terraform                                                 |
| データベース         | Supabase（PostgreSQL）                                     |
| デザイン            | Tailwind CSS                                              |
| 外部サービス         | Google Maps Platform                                      |
| バージョン管理       | GitHub                                                    |

## 主な機能

### ユーザー情報
- ユーザー新規登録
- ユーザーログイン
- ユーザー名変更

### 位置情報
- 位置情報のキーワード検索
- サジェスト表示
- 位置情報の保存
- 位置情報の削除

### レストラン情報
- 位置情報、キーワードに応じたレストラン情報取得

### カート情報
- カートへの商品追加
- カート内商品の数量変更
- カートまたはカート内商品の削除

### 注文履歴情報
- 注文履歴情報の表示
- 注文履歴情報の保存


## アーキテクチャ
![Image](https://github.com/user-attachments/assets/d2cd96a6-584e-4c92-ac95-a0df1f5b0936)

## ER 図
<img width="1066" height="919" alt="Image" src="https://github.com/user-attachments/assets/11772128-2180-44cc-add3-b7b068ee99c3" />
