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
      es: "Cargador AC 7.5kW GB/T",
      zh: "7.5kW 交流充电桩 GB/T",
    },
    description: {
      es: "Cargador AC de 7.5kW para uso residencial y comercial. Modelo ZCF200G1007 I con funciones inteligentes y diseño seguro.",
      zh: "7.5kW交流充电桩，适用于住宅和商业用途。型号ZCF200G1007 I，配备智能功能和安全设计。",
    },
    image: "/product-1.png",
    category: "ac",
    power: "7.5kW",
    features: {
      es: [
        "Inicio con tarjeta",
        "Funciones inteligentes",
        "Protección múltiple",
        "Instalación sencilla",
        "Soporte para carga con teléfono móvil",
      ],
      zh: [
        "支持刷卡启动",
        "智能功能",
        "多重保护",
        "安装简便",
        "支持手机充电",
      ],
    },
    specifications: {
      es: {
        "Modelo": "ZCF200G1007 I",
        "Potencia": "7.5kW",
        "Dimensiones": "250 × 1520 × 123mm",
        "Material": "PC + ABS",
        "Peso": "3.55kg (sin cable)",
        "Longitud del Cable": "5m (por defecto)",
        "Método de Instalación": "Montaje en pared",
        "Método de Inicio": "Inicio con tarjeta",
        "Voltaje de Entrada/Salida": "240V/50Hz",
        "Corriente Máxima/Potencia": "32A / 7.5kW",
        "Consumo en Espera": "≤ 5W",
        "Funciones Inteligentes": "Memoria de corte de energía, parada automática al llenar, corte de energía sin carga, reproducción de voz y actualización remota",
        "Diseño de Seguridad": "Protección contra sobrecarga, protección contra cortocircuito, protección de puesta a tierra, protección contra sobrecalentamiento, protección contra rayos",
      },
      zh: {
        "型号": "ZCF200G1007 I",
        "功率": "7.5kW",
        "产品尺寸": "250 × 1520 × 123mm",
        "产品材质": "PC + ABS",
        "设备重量": "3.55kg（不含枪线）",
        "枪线长度": "默认 5m",
        "安装方式": "壁挂式",
        "启动方式": "支持刷卡启动",
        "输入/输出电压": "240V/50Hz",
        "最大电流/功率": "32A / 7.5kW",
        "待机功耗": "≤ 5W",
        "智能功能": "支持断电记忆、充满自停、空载断电、语音播放及远程升级",
        "安全设计": "过载保护、短路保护、接地保护、过温保护、防雷保护",
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
    image: "/product-2.png",
    category: "ac",
    power: "7kW",
    features: {
      es: [
        "Conector Type 2 estándar",
        "Protección IP54",
        "Cumple estándares IEC",
        "Temperatura de trabajo amplia",
        "Soporte para carga con teléfono móvil",
      ],
      zh: [
        "标准Type 2连接器",
        "IP54防护等级",
        "符合IEC标准",
        "宽工作温度范围",
        "支持手机充电",
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
      es: "Cargador DC 60kW Dual Gun",
      zh: "60KW双枪直流桩 (GB+CCS2)",
    },
    description: {
      es: "Cargador DC de 60kW con doble pistola para estaciones de carga comerciales. Modelo YDL60K1000-GOD A2 con conectores GB+CCS2, ideal para centros comerciales, estacionamientos públicos y flotas.",
      zh: "60kW双枪直流充电桩，适用于商业充电站。型号YDL60K1000-GOD A2，配备GB+CCS2连接器，非常适合购物中心、公共停车场和车队。",
    },
    image: "/product-3.png",
    category: "dc",
    power: "60kW",
    features: {
      es: [
        "Dual gun GB+CCS2",
        "Pantalla táctil 7 pulgadas",
        "Carga con tarjeta y código QR",
        "Bajo consumo en vacío",
        "Soporte para carga con teléfono móvil",
      ],
      zh: [
        "双枪GB+CCS2",
        "7英寸触摸彩屏",
        "刷卡/扫码充电",
        "空载低功耗",
        "支持手机充电",
      ],
    },
    specifications: {
      es: {
        "Modelo": "YDL60K1000-GOD A2",
        "Potencia": "60kW",
        "Voltaje de Entrada AC": "480VAC ± 10%",
        "Voltaje de Salida": "200-1000VDC",
        "Pistola de Carga": "200A 5m, GB+CCS2",
        "Protección/Operación": "IP54, 4G/Ethernet, OCPP 1.6J",
        "Pantalla": "7 pulgadas táctil a color",
        "Funciones": "Carga con tarjeta / Carga con código QR / 4G / Ethernet",
        "Consumo/Filtrado": "Consumo en vacío <20W, salida con filtrado",
        "Embalaje": "Caja de madera para exportación",
        "Componentes Clave": "Módulo Infineon, pistola Wole o TGL, bajo consumo, filtrado magnético, componentes certificados CE (excepto módulo)",
      },
      zh: {
        "规格型号": "YDL60K1000-GOD A2",
        "功率": "60kW",
        "交流输入电压": "480VAC ± 10%",
        "输出电压": "200-1000VDC",
        "充电枪": "200A 5米，GB+CCS2",
        "防护/运营": "IP54，4G/以太网运营，联OCPP 1.6J",
        "显示屏": "7英寸触摸彩屏",
        "功能": "刷卡充电 / 扫码充电 / 4G / 以太网",
        "功耗/滤波": "空载功耗小于20W，输出加滤波",
        "包装": "出口木箱包装",
        "核心组件/特点": "英飞源模块、沃尔或泰格莱枪、空载低功耗功能、输出加滤波磁环、欧标认证器件（模块除外）",
      },
    },
    useCases: {
      es: [
        "Centros comerciales",
        "Estacionamientos públicos",
        "Flotas comerciales",
        "Estaciones de servicio",
      ],
      zh: [
        "购物中心",
        "公共停车场",
        "商业车队",
        "服务站",
      ],
    },
  },
]

