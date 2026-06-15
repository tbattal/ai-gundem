$r = Invoke-WebRequest -Uri 'http://localhost:3000/api/haberler?limit=2' -UseBasicParsing
Write-Output $r.Content
