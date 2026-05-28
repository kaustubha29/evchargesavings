export const DC_KW: Record<string, number> = {
  // Tesla
  "t-m3-rwd": 170, "t-m3-lr-rwd": 250, "t-m3-lr-awd": 250, "t-m3-perf": 250,
  "t-my-rwd": 170, "t-my-lr-rwd": 250, "t-my-lr-awd": 250, "t-my-perf": 250,
  "t-ms-dual": 250, "t-ms-plaid": 250,
  "t-mx-dual": 250, "t-mx-plaid": 250,
  "t-ct-awd": 350, "t-ct-beast": 350,
  // Hyundai
  "h-i5-sr-rwd": 220, "h-i5-lr-rwd": 220, "h-i5-lr-awd": 220, "h-i5n": 230,
  "h-i6-lr-rwd": 220, "h-i6-lr-awd": 220,
  "h-ioniq9-rwd": 350, "h-ioniq9": 350, "h-ioniq9-perf": 350,
  "h-kona": 100,
  // Kia
  "k-ev6-sr": 220, "k-ev6-lr-rwd": 250, "k-ev6-lr-awd": 220, "k-ev6-gt": 240,
  "k-ev9-wind": 230, "k-ev9-gt": 230,
  "k-niro": 85,
  // Chevrolet
  "c-eq-lt": 150, "c-eq-2rs": 150,
  "c-bl-lt": 190, "c-bl-rs": 190, "c-bl-ss": 190,
  "c-sv-wt": 350, "c-sv-rst": 350,
  "c-bolt": 55,
  // Cadillac
  "cd-lyriq-rwd": 190, "cd-lyriq-awd": 190,
  "cd-esciq": 350,
  "cd-optiq": 150, "cd-vistiq": 190,
  // Ford
  "f-mache-sr": 150, "f-mache-er": 150, "f-mache-awd": 150,
  "f-lt-sr": 131, "f-lt-er": 131,
  // Rivian
  "r-r1t-dual": 220, "r-r1t-quad": 220, "r-r1t-perf": 220,
  "r-r1s-dual": 220, "r-r1s-quad": 220,
  "r-r2": 200,
  // Volkswagen
  "vw-id4-sr": 135, "vw-id4-pro": 170, "vw-id4-awd": 170,
  "vw-idbuzz": 170, "vw-id7": 200,
  // BMW
  "bmw-i4-35": 195, "bmw-i4-40": 205, "bmw-i4-xd40": 205, "bmw-i4-m60": 205,
  "bmw-i5-40": 205, "bmw-i5-xd40": 205, "bmw-i5-m60": 205,
  "bmw-i7-e50": 195, "bmw-i7-60": 195, "bmw-i7-m70": 195,
  "bmw-ix-45": 200, "bmw-ix-60": 200, "bmw-ix-m70": 200,
  "bmw-ix1": 130, "bmw-ix2": 130,
  // Mercedes
  "mb-eqb": 100, "mb-eqe-350": 170, "mb-eqe-500": 170,
  "mb-eqs-450": 200, "mb-eqs-580": 200, "mb-eqssv": 200, "mb-g580": 200,
  // Audi
  "au-q4-40": 135, "au-q4-55": 135,
  "au-q6": 270,
  "au-q8-55": 170, "au-q8sb-55": 170, "au-sq8": 170,
  "au-etgt": 270,
  // Porsche
  "po-tay-rwd": 270, "po-tay-4s": 270, "po-tay-gts": 270, "po-tay-t": 270, "po-tay-ts": 270,
  "po-macan": 270, "po-macan4": 270,
  // Nissan
  "ni-leaf-s": 50, "ni-leaf-sv": 50,
  "ni-ariya-fwd": 130, "ni-ariya-awd": 130,
  // Honda
  "ho-pro-fwd": 150, "ho-pro-awd": 150,
  // Toyota / Lexus / Subaru
  "to-bz4x-fwd": 150, "to-bz4x-awd": 150,
  "lx-rz": 150,
  "su-sol-fwd": 150, "su-sol-awd": 150,
  // Polestar
  "ps-p2-lr1": 205, "ps-p2-lr2": 205, "ps-p3": 250, "ps-p4": 205,
  // Genesis
  "ge-gv60-sr": 260, "ge-gv60-perf": 260,
  "ge-gv70e": 235, "ge-g80e": 180, "ge-gv80c": 180,
  // Lucid
  "lu-air-pure": 250, "lu-air-gt": 300, "lu-air-saph": 300,
  "lu-grav-gt": 300,
  // Volvo
  "vo-ex30": 150, "vo-ex40": 150, "vo-ec40": 150, "vo-ex90": 250,
  // Mini / Mazda / Jaguar
  "mi-se": 50, "mi-ace": 95,
  "ma-mx30": 50,
  "ja-ipace": 100,
  // Ram / Jeep / Dodge
  "ra-1500rev": 350,
  "je-wags": 150,
  "do-charg-rt": 170, "do-charg-sp": 170,
};

// Approximate 10–80% charge time in minutes: (battery_kWh × 0.70) / dcKw × 60
export function chargeTime(battery: number, dcKw: number): number {
  return Math.round((battery * 0.70) / dcKw * 60);
}
