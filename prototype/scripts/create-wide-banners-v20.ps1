$root=Get-Location
$gen=(Join-Path $root 'design-sources/wide-banners')
$font=[Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $root 'public/style-check/fonts/Manrope-Variable.ttf')))
$items=@(
 @{id='season';file='season.png';a='Мастерская';b='готова к сезону';sub='Обновите рабочий пост';c1='#f9e9bb';c2='#ffc547';ink='#242b2b'},
 @{id='paint';file='paint.png';a='Материалы для';b='кузовных работ';sub='Подготовка и окраска';c1='#e6f2f4';c2='#8ed9ec';ink='#153541'},
 @{id='compressors';file='compressors.png';a='Компрессорное';b='оборудование';sub='Воздух для больших задач';c1='#07394d';c2='#228fa9';ink='#ffffff'},
 @{id='workshop';file='workshop.png';a='Рабочий пост';b='Всё на месте';sub='Оборудование и инструмент';c1='#3c2822';c2='#a46638';ink='#ffffff'}
)
foreach($i in $items){
 $data=[Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $gen $i.file)))
 $svg=@"
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="320" viewBox="0 0 1400 320"><style>@font-face{font-family:Manrope;src:url(data:font/ttf;base64,$font) format('truetype');font-weight:200 800}text{font-family:Manrope,sans-serif}</style><defs><linearGradient id="bg"><stop stop-color="$($i.c1)"/><stop offset=".72" stop-color="$($i.c2)"/><stop offset="1" stop-color="$($i.c1)"/></linearGradient><radialGradient id="light"><stop stop-color="white" stop-opacity=".24"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect width="1400" height="320" fill="url(#bg)"/><ellipse cx="850" cy="160" rx="450" ry="230" fill="url(#light)"/><image x="720" y="86" width="220" height="148" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,$data"/><g fill="$($i.ink)"><text x="450" y="132" font-size="26" font-weight="800">$($i.a)</text><text x="450" y="172" font-size="26" font-weight="800">$($i.b)</text><text x="450" y="205" font-size="14" font-weight="500">$($i.sub)</text></g></svg>
"@
 [IO.File]::WriteAllText((Join-Path $root "public/style-check/review-assets/banner-$($i.id)-v20.svg"),$svg)
}
