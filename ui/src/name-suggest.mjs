// The create-command response carries `name` (the name that would be used) and
// `suggested` (a free alternative). When the typed name is taken they differ;
// the "Use" affordance must propose the free one, otherwise it just re-suggests
// the colliding name. Pure helper, extracted so it is unit-testable.
export function pickNameToSuggest(res) {
  if (!res) return '';
  const s = res.taken ? res.suggested : res.name;
  return s || '';
}