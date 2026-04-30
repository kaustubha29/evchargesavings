import type { ChargingNetwork } from "@/features/charging/types";

export const NETWORKS: ChargingNetwork[] = [
  {
    id:"tesla", short:"T", name:"Tesla Supercharger", maxKw:250, perKwh:0.36, stations:2500,
    color:"#cc0000", bgColor:"#cc0000", rating:"ex", connectors:["NACS","CCS"], stars:4.8,
    desc:"Best reliability, now open to most EVs with adapter.",
    membershipLabel:"No membership required", memberPrice:null,
    pros:["Best uptime and reliability in the US","NACS native for Tesla owners","Open to all EVs via adapter since 2023","V4 stalls up to 500 kW coming"],
    cons:["Non-Tesla owners need NACS→CCS adapter (~$249)","Peak pricing during high-demand hours","Less common in rural areas than ChargePoint"],
  },
  {
    id:"ea", short:"EA", name:"Electrify America", maxKw:350, perKwh:0.48, stations:950,
    color:"#00b3e3", bgColor:"#00b3e3", rating:"gd", connectors:["CCS","CHAdeMO"], stars:3.8,
    desc:"Fastest speeds available, Hyundai/Kia owners often get free charging.",
    membershipLabel:"EA Pass+ ($4/mo)", memberPrice:4,
    pros:["Fastest DCFC available (up to 350 kW)","Free charging plans for Hyundai, Kia, VW owners","Wide highway coverage along US corridors"],
    cons:["Higher per-kWh pricing without a plan","Reliability issues reported at some locations","No NACS port yet — requires CCS connector"],
  },
  {
    id:"cp", short:"CP", name:"ChargePoint", maxKw:62, perKwh:0.42, stations:38000,
    color:"#0066b3", bgColor:"#0066b3", rating:"gd", connectors:["CCS","NACS"], stars:4.2,
    desc:"Largest L2 network in the US — prices vary widely by host.",
    membershipLabel:"ChargePoint plan ($9.99/mo saves up to 30%)", memberPrice:9.99,
    pros:["Largest network in the US (38,000+ stations)","Both NACS and CCS connectors","Strong L2 presence in hotels, workplaces, parking"],
    cons:["Pricing set by site hosts — can vary widely","Mostly L2, not ideal for quick top-ups on road trips","App required for some stations"],
  },
  {
    id:"evgo", short:"EG", name:"EVgo", maxKw:350, perKwh:0.45, stations:1000,
    color:"#5cb85c", bgColor:"#3da34d", rating:"gd", connectors:["CCS","CHAdeMO","NACS"], stars:4.0,
    desc:"GM, Nissan, and Subaru partnerships for free or discounted charging.",
    membershipLabel:"EVgo+ ($6.99/mo)", memberPrice:6.99,
    pros:["All three connector types: NACS, CCS, CHAdeMO","GM, Nissan, Subaru partnership discounts","Urban-focused — good for apartment dwellers"],
    cons:["Smaller network than EA or ChargePoint","Some older stations limited to 50 kW","Pricing can be higher without membership"],
  },
  {
    id:"rivian", short:"R", name:"Rivian Adventure", maxKw:200, perKwh:0.32, stations:600,
    color:"#ffcb47", bgColor:"#d4a429", rating:"ex", connectors:["NACS"], stars:4.5,
    desc:"Scenic locations, best rates — now open to all NACS vehicles.",
    membershipLabel:"No membership — pay per session", memberPrice:null,
    pros:["Lowest per-kWh pricing of any major DCFC network","Scenic adventure-focused locations","Expanding rapidly — open to all NACS EVs"],
    cons:["NACS only — CCS vehicles need an adapter","Fewer stations than Tesla or Electrify America","Locations skewed toward outdoor destinations"],
  },
  {
    id:"ionity", short:"IO", name:"IONITY (US coming)", maxKw:350, perKwh:0.50, stations:120,
    color:"#0080c0", bgColor:"#0080c0", rating:"ex", connectors:["CCS"], stars:4.3,
    desc:"Premium European network expanding to the US in 2026.",
    membershipLabel:"IONITY Pass ($17.99/mo)", memberPrice:17.99,
    pros:["Up to 350 kW charging speed","Premium station experience","Strong growth planned for US in 2026"],
    cons:["Very limited US presence currently","CCS only — no NACS","Higher per-kWh pricing without premium plan"],
  },
];
