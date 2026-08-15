export type Language = "es" | "zh"

export const aboutTranslations = {
  es: {
    // Navigation
    home: "Inicio",

    // Hero
    heroTitle: "Sobre Nosotros",
    heroSubtitle:
      "Desarrollamos infraestructura de recarga para vehículos eléctricos en América Latina, conectando innovación global con ejecución local.",

    // Who We Are
    whoWeAreTitle: "Quiénes Somos",
    whoWeAreParagraph1:
      "EsLatin es una empresa de infraestructura de recarga para vehículos eléctricos enfocada en América Latina. Nos especializamos en instalaciones profesionales, suministro de equipos y plataformas de gestión para redes de recarga.",
    whoWeAreParagraph2:
      "Trabajamos en estrecha colaboración con proveedores en China y América Latina para ofrecer equipos de calidad, precios competitivos y soporte técnico confiable. Nuestra misión es acelerar la adopción de vehículos eléctricos mediante la entrega de infraestructura práctica y escalable.",

    // Core Focus
    installationFocus: "Instalación",
    installationFocusDesc:
      "Servicios de instalación profesional para ubicaciones residenciales, comerciales e industriales, con técnicos certificados.",
    salesFocus: "Ventas",
    salesFocusDesc:
      "Cargadores para vehículos eléctricos de alta calidad para distribuidores y usuarios finales, con acceso a cadenas de suministro internacionales.",
    platformFocus: "Plataforma",
    platformFocusDesc:
      "Plataforma de gestión en la nube para monitoreo, facturación y operación de redes de carga.",

    // Why EsLatin
    whyEsLatinTitle: "Por qué elegir EsLatin",
    whyEsLatinSubtitle: "Nuestro enfoque en ejecución práctica y visión de largo plazo",

    executionTitle: "Ejecución Práctica",
    executionDesc:
      "Nos enfocamos en proyectos reales que funcionan. Sin promesas exageradas, solo instalaciones profesionales, equipos confiables y soporte técnico sólido para cada proyecto.",

    complianceTitle: "Cumplimiento Local",
    complianceDesc:
      "Todas nuestras instalaciones cumplen con estándares internacionales de seguridad y requisitos regulatorios locales. Equipos certificados y técnicos autorizados en cada mercado.",

    supplyChainTitle: "Cadena de Suministro Internacional",
    supplyChainDesc:
      "El acceso directo a fabricantes en China y distribuidores en América Latina garantiza precios competitivos, entregas fiables y soporte técnico continuo.",

    visionTitle: "Visión de Infraestructura de Largo Plazo",
    visionDesc:
      "Construimos infraestructura que durará décadas. Nuestro enfoque está en soluciones escalables y sostenibles que crecen con el mercado de vehículos eléctricos.",

    // Site survey
    surveyTitle: "Reserve una visita técnica",
    surveySubtitle:
      "Agende una visita técnica en Bogotá para evaluar las condiciones de su proyecto de recarga.",
    surveyAvailability: "Actualmente disponible solo en Bogotá, Colombia.",
    surveyLocationLabel: "Ciudad de servicio",
    surveyLocationValue: "Bogotá, Colombia",
    surveyAddressLabel: "Dirección del sitio",
    surveyAddressPlaceholder: "Barrio, dirección y punto de referencia",
    surveyAddressAutocompleteHint: "Escriba al menos 3 caracteres y seleccione una dirección en Bogotá.",
    surveyAddressSearching: "Buscando direcciones en Bogotá…",
    surveyAddressSelected: "Dirección verificada en Bogotá.",
    surveyAddressNoResults: "No encontramos coincidencias en Bogotá. Puede completar la dirección manualmente.",
    surveyAddressLookupError: "No pudimos buscar direcciones. Puede completar la dirección manualmente.",
    surveyAddressManualHint: "Ingrese una dirección completa en Bogotá.",
    surveyInviteTitle: "Código de invitación",
    surveyInviteDescription: "Esta reserva está disponible exclusivamente para clientes invitados por nuestros socios.",
    surveyInvitePartnerInstruction: "Si su reserva proviene de una marca asociada, solicite el código de invitación a su asesor comercial de la marca.",
    surveyInviteGeneralInstruction: "Si no está vinculado a una marca asociada, contáctenos por WhatsApp para solicitar un código.",
    surveyInviteWhatsapp: "Solicitar código por WhatsApp",
    surveyInvitePlaceholder: "Ingrese su código",
    surveyInviteVerify: "Validar código",
    surveyInviteVerifying: "Validando…",
    surveyInviteVerified: "Código validado. Ya puede continuar con la reserva.",
    surveyInviteChange: "Cambiar código",
    surveyInvitePartners: "Ingrese el código de invitación que recibió para continuar.",
    surveyInviteRequired: "Ingrese y valide su código de invitación para continuar.",
    surveyInviteInvalid: "El código no es válido. Verifique los caracteres e inténtelo de nuevo.",
    surveyInviteExpired: "El acceso de la invitación venció. Valide nuevamente su código.",
    surveyInviteRateLimited: "Demasiados intentos. Espere 15 minutos antes de volver a intentarlo.",
    surveyInviteUnavailable: "No pudimos validar el código en este momento. Inténtelo de nuevo más tarde.",
    surveyPhoneLabel: "Teléfono o WhatsApp",
    surveyPhonePlaceholder: "300 000 0000",
    surveyPhoneHint: "Puede ingresar el número colombiano con o sin +57.",
    surveyNameError: "Ingrese su nombre.",
    surveyAddressError: "Ingrese una dirección válida de al menos 6 caracteres.",
    surveyPhoneError: "Ingrese un número colombiano válido de 7 a 10 dígitos.",
    surveyEmailError: "Ingrese un correo electrónico válido.",
    surveyDateLabel: "Fecha preferida",
    surveyDatePlaceholder: "Seleccione una fecha",
    surveyDateHint: "Puede reservar desde mañana y hasta los próximos 10 días.",
    surveyDateError: "Seleccione una fecha entre mañana y los próximos 10 días.",
    surveyTimeLabel: "Hora preferida",
    surveyScheduleNote: "Horario: 08:00–17:00. Cada visita dura aproximadamente 1 hora; el último inicio es a las 16:00.",
    surveySelectDateFirst: "Seleccione primero una fecha.",
    surveyLoadingSlots: "Consultando la disponibilidad del equipo…",
    surveySlotsUnavailable: "No quedan horarios disponibles para esta fecha.",
    surveyTeamAvailability: "Mostramos un horario cuando al menos un técnico está disponible.",
    surveyChooseTime: "Elija un horario de 1 hora",
    surveySlotAvailable: "Disponible",
    surveySlotFull: "Completo",
    surveyBackendError: "No se pudo consultar el calendario. Inténtelo de nuevo en unos minutos.",
    surveyFormError: "Revise los campos marcados antes de confirmar la reserva.",
    surveyTimeError: "Seleccione un horario disponible.",
    surveySlotChangedError: "Este horario ya no está disponible. Seleccione otro.",
    surveyBookingError: "No se pudo confirmar la reserva. Inténtelo de nuevo en unos minutos.",
    surveyNetworkError: "No pudimos enviar la reserva. Verifique su conexión e inténtelo de nuevo.",
    surveyUnavailableOption: "no disponible",
    surveySubmit: "Confirmar reserva",
    surveySubmitting: "Confirmando la reserva…",
    surveySuccess: "Reserva confirmada. Técnico asignado:",
    surveyDingTalkConfirmed: "La cita se registró en el calendario compartido y se envió una invitación al técnico.",
    surveyDingTalkWarning: "La cita quedó en el calendario del técnico, pero no se pudo enviar la invitación del calendario compartido.",
    surveyEmailConfirmed: "Enviamos la confirmación al correo electrónico indicado.",
    surveyEmailWarning: "La reserva está confirmada, pero no pudimos enviar el correo. Si necesita ayuda, escriba a info@eslatin.com.co.",
    surveyMockNotice: "Modo de prueba local: esta reserva no se ha enviado a DingTalk.",

    // Contact
    contactTitle: "Contáctenos",
    contactSubtitle: "Estamos aquí para responder sus preguntas y hablar sobre su proyecto",

    whatsappTitle: "WhatsApp",
    whatsappDesc: "Contáctenos directamente vía WhatsApp para consultas rápidas y soporte técnico inmediato.",
    whatsappButton: "Abrir WhatsApp",

    emailTitle: "Correo Electrónico",
    emailDesc: "Envíenos un correo para consultas generales, propuestas o información detallada del proyecto.",

    formTitle: "Enviar un mensaje",
    formName: "Nombre",
    formEmail: "Correo Electrónico",
    formCompany: "Empresa (opcional)",
    formMessage: "Mensaje",
    formSubmit: "Enviar Mensaje",

    // Footer
    footerCopyright: "© 2025 EsLatin. Todos los derechos reservados.",
  },
  zh: {
    // Navigation
    home: "首页",

    // Hero
    heroTitle: "关于我们",
    heroSubtitle: "我们是一家专注于拉丁美洲的电动汽车充电基础设施提供商，连接全球创新与本地执行。",

    // Who We Are
    whoWeAreTitle: "我们是谁",
    whoWeAreParagraph1:
      "EsLatin是一家在拉丁美洲运营的电动汽车充电基础设施公司。我们专注于专业安装、设备销售以及充电网络运营平台解决方案。",
    whoWeAreParagraph2:
      "我们与中国和拉丁美洲的供应商紧密合作，提供优质设备、具有竞争力的价格和可靠的技术支持。我们的使命是通过提供实用且可扩展的基础设施来加速电动汽车的采用。",

    // Core Focus
    installationFocus: "安装",
    installationFocusDesc: "为住宅、商业和工业场所提供专业安装服务，配备认证技术人员。",
    salesFocus: "销售",
    salesFocusDesc: "为经销商和最终用户提供高质量的电动汽车充电器，可直接对接国际供应链。",
    platformFocus: "平台",
    platformFocusDesc: "基于云的管理软件，用于监控、计费和充电网络运营。",

    // Why EsLatin
    whyEsLatinTitle: "为什么选择 EsLatin",
    whyEsLatinSubtitle: "我们专注于实际执行和长期愿景",

    executionTitle: "实际执行",
    executionDesc: "我们专注于实际可行的项目。没有夸大的承诺，只有专业安装、可靠设备和每个项目的扎实技术支持。",

    complianceTitle: "本地合规",
    complianceDesc: "我们所有的安装都符合国际安全标准和当地监管要求。每个市场都有认证设备和持证技术人员。",

    supplyChainTitle: "国际供应链",
    supplyChainDesc: "直接对接中国制造商和拉丁美洲经销商，确保具有竞争力的价格、可靠的交付和持续的技术支持。",

    visionTitle: "长期基础设施愿景",
    visionDesc: "我们建设的基础设施将持续数十年。我们专注于可扩展和可持续的解决方案，与电动汽车市场共同成长。",

    // Site survey
    surveyTitle: "预约现场勘查",
    surveySubtitle: "在波哥大预约现场勘查，评估您的充电项目条件。",
    surveyAvailability: "目前仅在哥伦比亚波哥大提供服务。",
    surveyLocationLabel: "服务城市",
    surveyLocationValue: "波哥大，哥伦比亚",
    surveyAddressLabel: "勘查地点",
    surveyAddressPlaceholder: "街区、详细地址和参考地点",
    surveyAddressAutocompleteHint: "输入至少 3 个字符，然后选择一个波哥大地址。",
    surveyAddressSearching: "正在搜索波哥大地址…",
    surveyAddressSelected: "已确认波哥大地址。",
    surveyAddressNoResults: "未找到匹配的波哥大地址，您可以手动填写完整地址。",
    surveyAddressLookupError: "地址搜索暂时不可用，您可以手动填写完整地址。",
    surveyAddressManualHint: "请填写波哥大的完整地址。",
    surveyInviteTitle: "预约邀请码",
    surveyInviteDescription: "该预约服务目前仅向合作伙伴邀请的客户开放。",
    surveyInvitePartnerInstruction: "如您通过合作车企预约，请向对应车企销售顾问获取邀请码。",
    surveyInviteGeneralInstruction: "如您并非合作车企关联用户，请通过 WhatsApp 联系我们申请邀请码。",
    surveyInviteWhatsapp: "通过 WhatsApp 申请邀请码",
    surveyInvitePlaceholder: "请输入邀请码",
    surveyInviteVerify: "验证邀请码",
    surveyInviteVerifying: "正在验证…",
    surveyInviteVerified: "邀请码验证成功，您可以继续预约。",
    surveyInviteChange: "更换邀请码",
    surveyInvitePartners: "请输入您收到的邀请码以继续预约。",
    surveyInviteRequired: "请先输入并验证邀请码。",
    surveyInviteInvalid: "邀请码无效，请检查后重试。",
    surveyInviteExpired: "邀请码访问已过期，请重新验证。",
    surveyInviteRateLimited: "尝试次数过多，请等待 15 分钟后重试。",
    surveyInviteUnavailable: "暂时无法验证邀请码，请稍后重试。",
    surveyPhoneLabel: "电话或 WhatsApp",
    surveyPhonePlaceholder: "300 000 0000",
    surveyPhoneHint: "可以填写带或不带 +57 的哥伦比亚电话号码。",
    surveyNameError: "请输入姓名。",
    surveyAddressError: "请输入至少 6 个字符的有效地址。",
    surveyPhoneError: "请输入有效的 7 至 10 位哥伦比亚电话号码。",
    surveyEmailError: "请输入有效的电子邮箱。",
    surveyDateLabel: "期望日期",
    surveyDatePlaceholder: "选择日期",
    surveyDateHint: "可预约明天起至未来 10 天内的日期。",
    surveyDateError: "请选择明天起至未来 10 天内的日期。",
    surveyTimeLabel: "期望时间",
    surveyScheduleNote: "服务时段为 08:00–17:00；每次勘查预计 1 小时，最后可预约 16:00。",
    surveySelectDateFirst: "请先选择日期。",
    surveyLoadingSlots: "正在查询团队日历…",
    surveySlotsUnavailable: "该日期已没有可预约时段。",
    surveyTeamAvailability: "任意一名员工空闲即可预约，系统将自动分配。",
    surveyChooseTime: "选择一个 1 小时时段",
    surveySlotAvailable: "可预约",
    surveySlotFull: "预约已满",
    surveyBackendError: "暂时无法查询日历，请稍后重试。",
    surveyFormError: "请检查标记的内容后再确认预约。",
    surveyTimeError: "请选择一个可预约时段。",
    surveySlotChangedError: "该时段刚刚被预约，请选择其他时间。",
    surveyBookingError: "暂时无法确认预约，请稍后重试。",
    surveyNetworkError: "预约发送失败，请检查网络后重试。",
    surveyUnavailableOption: "不可预约",
    surveySubmit: "确认预约",
    surveySubmitting: "正在确认预约…",
    surveySuccess: "预约已确认，负责员工：",
    surveyDingTalkConfirmed: "预约已写入共享日历，并已向负责员工发送日程邀请。",
    surveyDingTalkWarning: "预约已写入员工日历，但共享日程邀请发送失败。",
    surveyEmailConfirmed: "确认邮件已发送至您填写的电子邮箱。",
    surveyEmailWarning: "预约已确认，但确认邮件发送失败。如需帮助，请联系 info@eslatin.com.co。",
    surveyMockNotice: "当前为本地测试模式，本次预约尚未写入钉钉。",

    // Contact
    contactTitle: "联系我们",
    contactSubtitle: "我们在这里回答您的问题并讨论您的项目",

    whatsappTitle: "WhatsApp",
    whatsappDesc: "通过WhatsApp直接联系我们，获取快速咨询和即时技术支持。",
    whatsappButton: "打开 WhatsApp",

    emailTitle: "电子邮件",
    emailDesc: "向我们发送电子邮件以进行一般咨询、提案或详细的项目信息。",

    formTitle: "发送消息",
    formName: "姓名",
    formEmail: "电子邮件",
    formCompany: "公司（可选）",
    formMessage: "消息",
    formSubmit: "发送消息",

    // Footer
    footerCopyright: "© 2025 EsLatin. 保留所有权利。",
  },
}
