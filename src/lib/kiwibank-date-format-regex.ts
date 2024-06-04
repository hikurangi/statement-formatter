export const KIWIBANK_DATE_FORMAT_REGEX =
  // On the statement I'm working off, the date format is: DD Mmm
  /(0[1-9]|[12][0-9]|30) (Sep|Apr|Jun|Nov)|(0[1-9]|[12][0-9]|3[01]) (Jan|Mar|May|Jul|Aug|Oct|Dec)|(0[1-9]|[12][0-9]) Feb/
// This regex is for a leap year - it considers Feb 29th valid
// 'Thirty days hath September, April, June and November. All the rest have thirty-one, Excepting February alone, And that has twenty-eight days clear And twenty-nine in each leap year.'

export const OUTPUT_DATE_FORMAT_REGEX =
  /(0[1-9]|[12][0-9]|30) (Sep|Apr|Jun|Nov)|(0[1-9]|[12][0-9]|3[01]) (Jan|Mar|May|Jul|Aug|Oct|Dec)|(0[1-9]|[12][0-9]) Feb \d{4}/

// tolerates weird years but who carez amirite
