export type Language = "es" | "zh"

export interface Product {
  id: string
  name: {
    es: string
    zh: string
  }
  description: {
    es: string
    zh: string
  }
  image: string
  category: "ac" | "dc" | "ultra-dc"
  power: string
  features: {
    es: string[]
    zh: string[]
  }
  specifications: {
    es: Record<string, string>
    zh: Record<string, string>
  }
  useCases: {
    es: string[]
    zh: string[]
  }
}

export const products: Product[] = [
  {
    id: "ac-residential",
    name: {
      es: "Cargador AC Residencial",
      zh: "交流住宅充电桩",
    },
    description: {
      es: "Cargador de nivel 2 para uso residencial y comercial ligero. Perfecto para hogares, oficinas y pequeños negocios.",
      zh: "2级充电桩，适用于住宅和轻型商业用途。非常适合家庭、办公室和小型企业。",
    },
    image: "/product-1.jpg",
    category: "ac",
    power: "7kW - 22kW",
    features: {
      es: [
        "Carga inteligente con app móvil",
        "Protección IP65",
        "Certificación CE y UL",
        "Instalación sencilla",
      ],
      zh: [
        "智能充电，支持手机APP",
        "IP65防护等级",
        "CE和UL认证",
        "安装简便",
      ],
    },
    specifications: {
      es: {
        "Potencia": "7kW - 22kW",
        "Voltaje": "220V / 380V",
        "Corriente": "32A - 63A",
        "Protección": "IP65",
        "Certificación": "CE, UL",
        "Garantía": "2 años",
      },
      zh: {
        "功率": "7kW - 22kW",
        "电压": "220V / 380V",
        "电流": "32A - 63A",
        "防护等级": "IP65",
        "认证": "CE, UL",
        "保修": "2年",
      },
    },
    useCases: {
      es: [
        "Viviendas unifamiliares",
        "Comunidades residenciales",
        "Oficinas y pequeños negocios",
        "Estacionamientos privados",
      ],
      zh: [
        "单户住宅",
        "住宅社区",
        "办公室和小型企业",
        "私人停车场",
      ],
    },
  },
  {
    id: "dc-fast",
    name: {
      es: "Cargador AC 7kW Type2",
      zh: "电动汽车交流充电桩 7kW Type2",
    },
    description: {
      es: "Cargador AC de 7kW para uso residencial y comercial. Modelo JSAC23032A-M con conector Type 2, ideal para hogares, oficinas y pequeños negocios.",
      zh: "7kW交流充电桩，适用于住宅和商业用途。型号JSAC23032A-M，配备Type 2连接器，非常适合家庭、办公室和小型企业。",
    },
    image: "/product-2.jpg",
    category: "ac",
    power: "7kW",
    features: {
      es: [
        "Conector Type 2 estándar",
        "Protección IP54",
        "Cumple estándares IEC",
        "Temperatura de trabajo amplia",
      ],
      zh: [
        "标准Type 2连接器",
        "IP54防护等级",
        "符合IEC标准",
        "宽工作温度范围",
      ],
    },
    specifications: {
      es: {
        "Modelo": "JSAC23032A-M",
        "Potencia Nominal": "7kW",
        "Voltaje Nominal": "230V±15% 50HZ±1HZ",
        "Corriente Nominal": "32A",
        "Conector": "Type 2",
        "Protección": "IP54",
        "Temperatura de Trabajo": "-30℃ ~ +50℃",
        "Temperatura de Almacenamiento": "-30℃ ~ +70℃",
        "Estándar": "IEC62196-1, IEC61851-1",
        "Operación": "4G/Ethernet, OCPP 1.6J, Inicio con tarjeta",
        "Origen": "Made in China",
      },
      zh: {
        "型号": "JSAC23032A-M",
        "额定功率": "7kW",
        "额定电压": "230V±15% 50HZ±1HZ",
        "额定电流": "32A",
        "充电枪型号": "Type 2",
        "防护等级": "IP54",
        "工作环境温度": "-30℃ ~ +50℃",
        "存储温度": "-30℃ ~ +70℃",
        "执行标准": "IEC62196-1, IEC61851-1",
        "运营": "4G/以太网运营，联OCPP 1.6J，刷卡启动",
        "产地": "Made in China",
      },
    },
    useCases: {
      es: [
        "Viviendas unifamiliares",
        "Comunidades residenciales",
        "Oficinas y pequeños negocios",
        "Estacionamientos privados",
      ],
      zh: [
        "单户住宅",
        "住宅社区",
        "办公室和小型企业",
        "私人停车场",
      ],
    },
  },
  {
    id: "dc-ultra",
    name: {
      es: "Cargador DC Ultra-Rápido",
      zh: "直流超快充桩",
    },
    description: {
      es: "Cargador DC de ultra alta potencia para estaciones de carga de alto tráfico. Perfecto para corredores de carga y estaciones de servicio.",
      zh: "超高压直流充电桩，适用于高流量充电站。非常适合充电走廊和服务站。",
    },
    image: "/product-3.jpg",
    category: "ultra-dc",
    power: "350kW",
    features: {
      es: [
        "Carga ultra-rápida 350kW",
        "Dual gun simultáneo",
        "Sistema de gestión avanzado",
        "Mantenimiento predictivo",
      ],
      zh: [
        "350kW超快充电",
        "双枪同时充电",
        "高级管理系统",
        "预测性维护",
      ],
    },
    specifications: {
      es: {
        "Potencia": "350kW",
        "Voltaje": "200V - 1000V DC",
        "Corriente": "500A",
        "Protección": "IP54",
        "Certificación": "CE, OCPP 2.0.1",
        "Garantía": "5 años",
      },
      zh: {
        "功率": "350kW",
        "电压": "200V - 1000V DC",
        "电流": "500A",
        "防护等级": "IP54",
        "认证": "CE, OCPP 2.0.1",
        "保修": "5年",
      },
    },
    useCases: {
      es: [
        "Corredores de carga",
        "Estaciones de servicio",
        "Flotas de alto volumen",
        "Aplicaciones comerciales a gran escala",
      ],
      zh: [
        "充电走廊",
        "服务站",
        "大容量车队",
        "大规模商业应用",
      ],
    },
  },
]

