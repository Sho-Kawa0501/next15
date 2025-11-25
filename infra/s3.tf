resource "aws_s3_bucket" "site" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls        = true
  block_public_policy      = true
  ignore_public_acls       = true
  restrict_public_buckets  = true
}

# OAC（CloudFront が S3 に署名付きでアクセス）
resource "aws_cloudfront_origin_access_control" "oac" {
  name                                  = "s3-oac"
  origin_access_control_origin_type     = "s3"
  description                           = "Origin Access Control for S3"
  signing_behavior                      = "always"
  signing_protocol                      = "sigv4"
}

# S3 ポリシーを CloudFront 向けに適用
data "aws_iam_policy_document" "s3_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.s3_policy.json
}
