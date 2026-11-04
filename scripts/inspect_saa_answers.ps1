Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-XlsxAnswers($filePath) {
  $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
  $ssEntry = $zip.GetEntry('xl/sharedStrings.xml')
  $ss = @()
  if ($ssEntry) {
    $stream = $ssEntry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    [xml]$ssXml = $reader.ReadToEnd()
    $reader.Close()
    $ss = $ssXml.sst.si | ForEach-Object { 
      if ($_.t) { $_.t } else { ($_.r | ForEach-Object { $_.t }) -join '' }
    }
  }
  $sheetEntry = $zip.GetEntry('xl/worksheets/sheet1.xml')
  $stream = $sheetEntry.Open()
  $reader = New-Object System.IO.StreamReader($stream)
  [xml]$sheetXml = $reader.ReadToEnd()
  $reader.Close()
  $zip.Dispose()

  $results = @()
  foreach ($row in $sheetXml.worksheet.sheetData.row) {
    $line = @()
    foreach ($c in $row.c) {
      $val = $c.v
      if ($c.t -eq 's' -and $val -ne $null) { 
        $idx = [int]$val
        if ($idx -lt $ss.Count) { $val = $ss[$idx] }
      }
      $line += "$val"
    }
    $results += ($line -join "`t")
  }
  return $results
}

$files = Get-ChildItem -Recurse reference_questions_local/saa -Filter "*.xlsx"
foreach ($f in $files) {
  Write-Host "=== FILE: $($f.FullName) ==="
  $rows = Get-XlsxAnswers $f.FullName
  $rows | Select-Object -First 40 | ForEach-Object { Write-Host $_ }
}
