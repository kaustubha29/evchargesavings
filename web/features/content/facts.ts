export interface FeelGoodFact {
  icon: string;
  render: (savings: number, co2Lbs: number, gasAnnual: number, evAnnual: number) => string;
}

export const FACTS: FeelGoodFact[] = [
  {
    icon: "🌲",
    render: (_s, co2) =>
      `Driving electric saves about <b>${Math.round(co2).toLocaleString()} lbs of CO₂</b> per year — like planting ${Math.round(co2 / 48)} trees annually.`,
  },
  {
    icon: "✈️",
    render: (_s, co2) =>
      `Your annual CO₂ savings equal roughly <b>${(co2 / 1100).toFixed(1)} round-trip flights</b> from New York to LA avoided.`,
  },
  {
    icon: "☕",
    render: (save) =>
      `That <b>$${Math.round(save).toLocaleString()}/yr</b> savings buys about <b>${Math.round(save / 5).toLocaleString()} coffees</b> a year.`,
  },
  {
    icon: "⛽",
    render: (_s, _c, gasAnnual) =>
      `You're replacing <b>${Math.round(gasAnnual / 3.4).toLocaleString()} gallons</b> of gas per year with electrons from your wall.`,
  },
  {
    icon: "🏠",
    render: (save) =>
      `Over 10 years, that adds up to <b>$${Math.round(save * 10).toLocaleString()}</b> back in your pocket.`,
  },
  {
    icon: "🔋",
    render: (save, _c, gasAnnual, evAnnual) =>
      `Your EV fuel bill of <b>$${Math.round(evAnnual).toLocaleString()}/yr</b> is ${Math.round((1 - evAnnual / gasAnnual) * 100)}% lower than the gas equivalent.`,
  },
  {
    icon: "🌍",
    render: (_s, co2) =>
      `${(co2 / 2204).toFixed(2)} metric tons of CO₂ saved — equivalent to ${Math.round(co2 / 888)} months of the average car off the road.`,
  },
];
