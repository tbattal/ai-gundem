$urls = @(
  'http://localhost:3000/',
  'http://localhost:3000/haber/openai-gpt-5-duyuruldu',
  'http://localhost:3000/haber/anthropic-claude-4-7-uretken-yazma',
  'http://localhost:3000/kategori/llm',
  'http://localhost:3000/kategori/robotik',
  'http://localhost:3000/kategori/politika',
  'http://localhost:3000/api/haberler',
  'http://localhost:3000/api/haber/openai-gpt-5-duyuruldu',
  'http://localhost:3000/sitemap.xml',
  'http://localhost:3000/rss.xml',
  'http://localhost:3000/robots.txt',
  'http://localhost:3000/arama?q=claude',
  'http://localhost:3000/haber/yok-boyle-bir-haber'
)
foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 30
    Write-Output ("{0}  ->  {1}  ({2})" -f $r.StatusCode, $u, $r.Headers['Content-Type'])
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Output ("{0}  ->  {1}  ({2})" -f $code, $u, $_.Exception.Message.Split([Environment]::NewLine)[0])
  }
}
