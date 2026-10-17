$auditRoot = $PSScriptRoot
$originalPath = Join-Path $auditRoot 'claude-review/szoveg-audit/szoveg-audit-talalatok.csv'
if (Test-Path -LiteralPath $originalPath) {
  $originalRows = @(Import-Csv -LiteralPath $originalPath -Encoding utf8)
} else {
  # The delivered ledger preserves all original fields needed for regeneration.
  # This also works in a checkout without the owner's untracked audit bundle.
  $originalRows = @(Import-Csv -LiteralPath (Join-Path $auditRoot 'text-audit-status.csv') -Encoding utf8 | ForEach-Object {
    [PSCustomObject]@{ reviewer=$_.audit_biralo; id=$_.id; sev=$_.prioritas; location=$_.hely; current=$_.audit_jelenlegi; problem=$_.audit_indoklas; fix=$_.audit_javaslat }
  })
}
if ($originalRows.Count -ne 506 -or @($originalRows.id | Sort-Object -Unique).Count -ne 506) {
  throw 'Expected exactly 506 unique original finding IDs.'
}
$dispositions = Get-Content -LiteralPath (Join-Path $auditRoot 'text-audit-dispositions.json') -Raw -Encoding utf8 | ConvertFrom-Json
$byId = @{}
foreach ($group in $dispositions.groups) {
  foreach ($findingId in $group.ids) {
    if ($byId.ContainsKey($findingId)) { throw "Duplicate disposition: $findingId" }
    if ($findingId -notin $originalRows.id) { throw "Unknown finding: $findingId" }
    $byId[$findingId] = $group
  }
}
$result = foreach ($row in $originalRows) {
  $disposition = $byId[$row.id]
  $defaultOwner = if ($row.id -like 'ENS-*') { 'CMS / angol nyelvi lektor' } elseif ($row.id -match '^(HUB|ENB|DEB)-') { 'Jogi / nyelvi lektor' } else { 'Nyelvi lektor / szerkesztés' }
  [PSCustomObject]@{
    id = $row.id
    audit_biralo = $row.reviewer
    prioritas = $row.sev
    statusz = if ($disposition) { $disposition.status } else { 'NYITOTT_ELLENORZES' }
    felelos = if ($disposition) { $disposition.owner } else { $defaultOwner }
    bizonyitek = if ($disposition) { $disposition.evidence } else { 'Az eredeti audit javaslata; önálló teljes forrás- és jelentésellenőrzése még nincs lezárva.' }
    kovetkezo_lepes = if ($disposition) { $disposition.next } else { 'Az alábbi konkrét auditjavaslat ellenőrzése a magyar forrással és a jelenlegi rendereléssel; csak igazolt eltérés alkalmazható.' }
    hely = $row.location
    audit_jelenlegi = $row.current
    audit_indoklas = $row.problem
    audit_javaslat = $row.fix
  }
}
$result | Export-Csv -LiteralPath (Join-Path $auditRoot 'text-audit-status.csv') -NoTypeInformation -Encoding utf8
$result | Where-Object { $_.statusz -match '^(NYITOTT|RESZBEN)' } | Export-Csv -LiteralPath (Join-Path $auditRoot 'text-audit-open-items.csv') -NoTypeInformation -Encoding utf8
$result | Group-Object statusz | Sort-Object Name | Select-Object Name,Count | Format-Table -AutoSize
