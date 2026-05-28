// EPA-rated or manufacturer-claimed 0-60 mph times in seconds
export const ZERO_TO_60: Record<string, number> = {
  // Tesla
  "t-m3-rwd": 5.8, "t-m3-lr-rwd": 4.2, "t-m3-lr-awd": 4.1, "t-m3-perf": 3.1,
  "t-my-rwd": 5.9, "t-my-lr-rwd": 4.6, "t-my-lr-awd": 4.2, "t-my-perf": 3.5,
  "t-ms-dual": 3.1, "t-ms-plaid": 1.99,
  "t-mx-dual": 3.8, "t-mx-plaid": 2.6,
  "t-ct-awd": 4.1, "t-ct-beast": 2.6,
  // Hyundai
  "h-i5-sr-rwd": 8.5, "h-i5-lr-rwd": 5.1, "h-i5-lr-awd": 5.1, "h-i5n": 3.4,
  "h-i6-lr-rwd": 5.1, "h-i6-lr-awd": 5.1,
  "h-ioniq9-rwd": 6.8, "h-ioniq9": 5.3, "h-ioniq9-perf": 4.2,
  "h-kona": 6.4,
  // Kia
  "k-ev6-sr": 7.3, "k-ev6-lr-rwd": 7.3, "k-ev6-lr-awd": 5.1, "k-ev6-gt": 3.4,
  "k-ev9-wind": 6.7, "k-ev9-gt": 5.3,
  "k-niro": 6.5,
  // Chevrolet
  "c-eq-lt": 7.5, "c-eq-2rs": 6.5,
  "c-bl-lt": 6.5, "c-bl-rs": 5.5, "c-bl-ss": 4.0,
  "c-sv-wt": 6.5, "c-sv-rst": 6.5,
  "c-bolt": 6.5,
  // Cadillac
  "cd-lyriq-rwd": 5.7, "cd-lyriq-awd": 4.9,
  "cd-esciq": 4.9, "cd-optiq": 6.5, "cd-vistiq": 5.5,
  // Ford
  "f-mache-sr": 7.8, "f-mache-er": 7.0, "f-mache-awd": 5.1,
  "f-lt-sr": 7.0, "f-lt-er": 4.5,
  // Rivian
  "r-r1t-dual": 4.5, "r-r1t-quad": 3.0, "r-r1t-perf": 2.8,
  "r-r1s-dual": 4.5, "r-r1s-quad": 3.1,
  "r-r2": 5.0,
  // Volkswagen
  "vw-id4-sr": 8.0, "vw-id4-pro": 7.9, "vw-id4-awd": 5.4,
  "vw-idbuzz": 5.7, "vw-id7": 5.8,
  // BMW
  "bmw-i4-35": 5.8, "bmw-i4-40": 5.5, "bmw-i4-xd40": 5.1, "bmw-i4-m60": 3.9,
  "bmw-i5-40": 5.7, "bmw-i5-xd40": 5.4, "bmw-i5-m60": 3.8,
  "bmw-i7-e50": 5.7, "bmw-i7-60": 4.5, "bmw-i7-m70": 3.5,
  "bmw-ix-45": 5.7, "bmw-ix-60": 4.6, "bmw-ix-m70": 3.8,
  "bmw-ix1": 6.6, "bmw-ix2": 5.4,
  // Mercedes-Benz
  "mb-eqb": 7.5, "mb-eqe-350": 6.2, "mb-eqe-500": 5.1,
  "mb-eqs-450": 5.5, "mb-eqs-580": 4.3, "mb-eqssv": 4.9, "mb-g580": 4.7,
  // Audi
  "au-q4-40": 7.7, "au-q4-55": 5.8,
  "au-q6": 5.9,
  "au-q8-55": 5.6, "au-q8sb-55": 5.6, "au-sq8": 4.5,
  "au-etgt": 3.9,
  // Porsche
  "po-tay-rwd": 5.4, "po-tay-4s": 4.0, "po-tay-gts": 3.5, "po-tay-t": 3.2, "po-tay-ts": 2.4,
  "po-macan": 5.9, "po-macan4": 5.2,
  // Nissan
  "ni-leaf-s": 7.4, "ni-leaf-sv": 7.4,
  "ni-ariya-fwd": 7.4, "ni-ariya-awd": 5.1,
  // Honda
  "ho-pro-fwd": 6.8, "ho-pro-awd": 5.5,
  // Toyota / Lexus / Subaru
  "to-bz4x-fwd": 8.2, "to-bz4x-awd": 6.5,
  "lx-rz": 5.0,
  "su-sol-fwd": 8.2, "su-sol-awd": 6.5,
  // Polestar
  "ps-p2-lr1": 6.7, "ps-p2-lr2": 4.5, "ps-p3": 4.8, "ps-p4": 3.8,
  // Genesis
  "ge-gv60-sr": 8.0, "ge-gv60-perf": 3.7,
  "ge-gv70e": 4.2, "ge-g80e": 4.9, "ge-gv80c": 5.7,
  // Lucid
  "lu-air-pure": 4.4, "lu-air-gt": 3.0, "lu-air-saph": 1.89,
  "lu-grav-gt": 3.5,
  // Volvo
  "vo-ex30": 5.3, "vo-ex40": 4.5, "vo-ec40": 4.5, "vo-ex90": 4.9,
  // Mini / Mazda / Jaguar
  "mi-se": 7.3, "mi-ace": 7.0,
  "ma-mx30": 8.7,
  "ja-ipace": 4.5,
  // Ram / Jeep / Dodge
  "ra-1500rev": 4.4,
  "je-wags": 6.5,
  "do-charg-rt": 5.9, "do-charg-sp": 3.3,
  // Buick / GMC / Acura
  "bu-electra": 5.9,
  "gmc-hev-pk": 3.0, "gmc-hev-su": 3.5, "gmc-siev": 4.5,
  "ac-zdx-rwd": 6.2, "ac-zdx-ts": 4.9,
  // Rolls-Royce / Lotus / BYD / Alfa
  "rr-specter": 4.4,
  "lo-eletre": 2.9,
  "by-seal": 5.2,
  "ar-junior": 5.7,
  // Scout
  "sc-terra": 5.0, "sc-trvlr": 5.0,
};
