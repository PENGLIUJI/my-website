(function () {
  const storageKey = "tuoke-manager-state-v1";
  const today = new Date();

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const noneOption = "无";
  const defaultBuildingNumbers = [noneOption, "1栋", "2栋", "3栋", "4栋", "5栋", "6栋", "7栋", "8栋", "9栋", "10栋", "11栋", "12栋"];
  const defaultUnits = [noneOption, "1单元", "2单元", "3单元", "4单元"];
  const renovationStages = ["拆改", "水电", "瓷砖", "木工", "油漆", "吊顶", "定制安装", "软装进场", "已入住", "暂不清楚"];
  const propertyCustomValue = "__custom_property__";
  const renovationCustomValue = "__custom_result__";
  const customerTypes = ["A类", "B类", "C类", "D类"];
  const customerFollowStages = ["没有到过店", "已到过店", "已做过预算", "已成交"];
  const storeVisitResults = ["逛一圈就走", "有意向", "做了预算，下次再来", "已成交"];
  const forceAStages = ["已到过店", "已做过预算", "已成交"];
  const notInstalledStatus = "未安装";
  const installedUnpaidStatus = "已安装，没有收到尾款";
  const installedPaidStatus = "已安装，收到尾款";
  const afterSaleStatuses = [notInstalledStatus, installedUnpaidStatus, installedPaidStatus];
  const dealLifecycleStatuses = ["已成交且交完全款", "已成交没有配送", "已送装没结尾款", "已经配送且已经结尾款"];
  const afterSaleIssueStatuses = ["无售后问题", "处理中", "已解决", "需老板处理"];
  const salesShareRatios = Array.from({ length: 10 }, (_, index) => `${(index + 1) * 10}%`);
  const commissionPointOptions = Array.from({ length: 10 }, (_, index) => `${index + 1}点`);
  const orderChangeStatuses = ["没有改单", "已改单", "已退货", "已换货", "升单"];
  const orderChangeDirectStatuses = ["没有改单", "升单"];
  const dealSourceOptions = ["空白客户", "异业介绍", "师傅介绍", "客户介绍", "装修公司介绍", "其他"];
  const contactLevels = ["VIP等级已经介绍客户成交", "会介绍客户", "常沟通没介绍过客户", "少联系"];
  const channelIndustryCustomValue = "__custom_channel_industry__";
  const channelIndustryOptions = [
    "瓷砖",
    "水电",
    "木工",
    "灯饰",
    "卫浴",
    "监理",
    "装修公司",
    "设计师",
    "定制柜/全屋定制",
    "门窗",
    "地板",
    "墙纸墙布",
    "窗帘布艺",
    "石材",
    "木门",
    "防水",
    "空调/新风",
    "智能家居",
    "家电",
    "软装",
    "建材卖场",
    "房产中介",
    "其他行业"
  ];
  const demoLoggedInEmployeeId = "emp-chen";
  const viewMeta = {
    overview: { role: "boss", eyebrow: "老板后台", title: "外勤管理总览" },
    logs: { role: "boss", eyebrow: "老板后台", title: "日志审核" },
    staff: { role: "boss", eyebrow: "老板后台", title: "员工绩效管理" },
    settings: { role: "boss", eyebrow: "老板后台", title: "审核规则设置" },
    field: { role: "employee", eyebrow: "员工端", title: "员工外勤填报" },
    customers: { role: "employee", eyebrow: "员工端", title: "客户跟踪汇总" }
  };
  const mockProperties = [
    { name: "国贸 SOHO", buildings: ["7栋", "8栋", "9栋", "10栋"], units: ["1单元", "2单元", "3单元"] },
    { name: "建外写字楼", buildings: ["1栋", "2栋", "3栋", "4栋"], units: ["1单元", "2单元"] },
    { name: "世贸天阶", buildings: ["5栋", "6栋", "7栋"], units: ["1单元", "2单元", "3单元"] },
    { name: "合生汇公寓", buildings: ["1栋", "2栋", "3栋"], units: ["1单元", "2单元", "3单元", "4单元"] },
    { name: "金地中心", buildings: ["8栋", "9栋", "10栋"], units: ["1单元", "2单元"] },
    { name: "远洋国际中心", buildings: ["3栋", "4栋", "5栋"], units: ["1单元", "2单元", "3单元"] },
    { name: "中粮广场", buildings: ["1栋", "2栋", "3栋"], units: ["1单元", "2单元"] },
    { name: "万科城市花园", buildings: ["4栋", "5栋", "6栋"], units: ["1单元", "2单元", "3单元"] },
    { name: "华贸公寓", buildings: ["11栋", "12栋", "13栋"], units: ["1单元", "2单元"] },
    { name: "龙湖天街", buildings: ["6栋", "7栋", "8栋"], units: ["1单元", "2单元", "3单元"] }
  ];

  function minutesAgo(minutes) {
    return new Date(Date.now() - minutes * 60000).toISOString();
  }

  function daysAgo(days, hour = 10, minute = 0) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  }

  function formatTime(value) {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date(value));
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(value));
  }

  function daysSince(value) {
    return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000));
  }

  function sameDay(value, dateValue) {
    const target = new Date(value);
    const selected = dateValue ? new Date(dateValue + "T00:00:00") : today;
    return target.getFullYear() === selected.getFullYear()
      && target.getMonth() === selected.getMonth()
      && target.getDate() === selected.getDate();
  }

  function initials(name) {
    return name.slice(-2);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function extractFloor(value) {
    const match = String(value || "").match(/(\d{1,2})\s*(层|樓|楼|F)/i);
    return match ? match[1] : "";
  }

  function isNoneOption(value) {
    return String(value || "").trim() === noneOption;
  }

  function normalizeChoiceList(values = []) {
    return [noneOption, ...values.filter((value) => value && !isNoneOption(value))]
      .filter((value, index, list) => list.indexOf(value) === index);
  }

  function formatBuildingUnit(buildingNumber, unit) {
    return [buildingNumber, unit]
      .filter((value) => value && !isNoneOption(value))
      .join("");
  }

  function displayBuilding(log) {
    if (!isCustomerContactLog(log) && !log.property && !log.buildingNumber && !log.unit && !log.buildingBlock && !log.building) {
      return "资源登记";
    }
    if (log.property || log.buildingNumber || log.unit || log.buildingBlock) {
      const buildingPart = formatBuildingUnit(log.buildingNumber || log.buildingBlock, log.unit);
      return [log.property, buildingPart].filter(Boolean).join(" ");
    }
    return log.building || "未选择楼盘";
  }

  function displayRoom(log) {
    if (!isCustomerContactLog(log) && !log.room) return "无需房号";
    return log.room || "未选择房号";
  }

  function displayCustomerType(log) {
    return log.customerType || "未分类";
  }

  function displayContactLevel(log) {
    if (!["master", "channel"].includes(log.contactType)) return "";
    return contactLevels.includes(log.contactLevel) ? log.contactLevel : contactLevels[3];
  }

  function displayWechatAdded(log) {
    if (log.wechatProof || log.wechatFileName || log.wechatFileNames?.length || log.wechatAvatarFileName || log.wechatName) return "有";
    if (log.wechatAdded === "有" || log.wechatAdded === "没有") return log.wechatAdded;
    return "没有";
  }

  function normalizeCustomerFollowStage(value) {
    const map = {
      "未上传微信记录": "没有到过店",
      "已加微信": "没有到过店",
      "等待回复": "没有到过店",
      "已发方案": "已做过预算",
      "已约到店": "已到过店",
      "已到店": "已到过店",
      "到过店": "已到过店",
      "逛一圈就走": "已到过店",
      "有意向": "已到过店",
      "做了预算，下次再来": "已做过预算",
      "做过预算": "已做过预算",
      "已做预算": "已做过预算",
      "成交": "已成交"
    };
    const normalized = map[value] || value || "没有到过店";
    return customerFollowStages.includes(normalized) ? normalized : "没有到过店";
  }

  function normalizeStoreVisitResult(value) {
    const map = {
      "做预算，下次再来": "做了预算，下次再来",
      "做了预算下次再来": "做了预算，下次再来",
      "做预算下次再来": "做了预算，下次再来",
      "成交": "已成交"
    };
    const normalized = map[value] || value || storeVisitResults[0];
    return storeVisitResults.includes(normalized) ? normalized : storeVisitResults[0];
  }

  function storeVisitResultStage(value) {
    const result = normalizeStoreVisitResult(value);
    if (result === "已成交") return "已成交";
    if (result === "做了预算，下次再来") return "已做过预算";
    return "已到过店";
  }

  function storeVisitResultFromStage(value) {
    const stage = normalizeCustomerFollowStage(value);
    if (stage === "已成交") return "已成交";
    if (stage === "已做过预算") return "做了预算，下次再来";
    return "有意向";
  }

  function shouldForceCustomerTypeA(value) {
    return forceAStages.includes(normalizeCustomerFollowStage(value));
  }

  function customerFollowStageRank(value) {
    const stage = normalizeCustomerFollowStage(value);
    const index = customerFollowStages.indexOf(stage);
    return index >= 0 ? index : 0;
  }

  function highestCustomerFollowStage(first, second) {
    return customerFollowStageRank(second) > customerFollowStageRank(first)
      ? normalizeCustomerFollowStage(second)
      : normalizeCustomerFollowStage(first);
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function normalizeIdentityText(value) {
    return String(value || "").trim().replace(/\s+/g, "").toLowerCase();
  }

  function wechatHomepageKey(record) {
    const fingerprint = record?.wechatHomepageFingerprint || record?.wechatProof?.homepageFingerprint || "";
    if (fingerprint) return `homepage:${normalizeIdentityText(fingerprint)}`;
    const avatarName = record?.wechatAvatarFileName || record?.wechatProof?.avatarFileName || "";
    return avatarName ? `avatar-file:${normalizeIdentityText(avatarName)}` : "";
  }

  function hasWechatHomepageEvidence(record) {
    return Boolean(
      record?.wechatHomepageFingerprint
      || record?.wechatAvatarFileName
      || record?.wechatProof?.homepageFingerprint
      || record?.wechatProof?.avatarFileName
    );
  }

  function usablePhoneKey(value) {
    const phone = normalizePhone(value);
    return phone.length >= 5 ? phone : "";
  }

  function customerAddressKey(record) {
    const building = normalizeIdentityText(record?.building || displayBuilding(record || {}));
    const room = normalizeIdentityText(record?.room || displayRoom(record || {}));
    if (!building || !room) return "";
    if (["未选择楼盘", "资源登记"].some((text) => building.includes(normalizeIdentityText(text)))) return "";
    if (["未选择房号", "无需房号"].some((text) => room.includes(normalizeIdentityText(text)))) return "";
    return `${building}|${room}`;
  }

  function customerIdentityMatchReason(source, target) {
    const sourceAddress = customerAddressKey(source);
    const targetAddress = customerAddressKey(target);
    if (sourceAddress && targetAddress && sourceAddress === targetAddress) return "房号相同";
    const sourcePhone = usablePhoneKey(source?.phone);
    const targetPhone = usablePhoneKey(target?.phone);
    if (sourcePhone && targetPhone && sourcePhone === targetPhone) return "电话相同";
    const sourceWechat = wechatHomepageKey(source);
    const targetWechat = wechatHomepageKey(target);
    if (sourceWechat && targetWechat && sourceWechat === targetWechat) return "微信主页相同";
    return "";
  }

  function resourceIdentityMatchReason(source, target) {
    const sourceType = source?.contactType || "customer";
    const targetType = target?.contactType || "customer";
    if (!["master", "channel"].includes(sourceType) || sourceType !== targetType) return "";
    const sourcePhone = usablePhoneKey(source?.phone);
    const targetPhone = usablePhoneKey(target?.phone);
    if (sourcePhone && targetPhone && sourcePhone === targetPhone) return "电话相同";
    const sourceWechat = wechatHomepageKey(source);
    const targetWechat = wechatHomepageKey(target);
    if (sourceWechat && targetWechat && sourceWechat === targetWechat) return "微信主页相同";
    return "";
  }

  function primaryRecordForLog(log) {
    const sourceLog = log?.oldCustomerLogId ? getLog(log.oldCustomerLogId) : null;
    return sourceLog || log;
  }

  function priorityFromContactLevel(level) {
    if (level === contactLevels[0]) return "A类";
    if (level === contactLevels[1]) return "B类";
    if (level === contactLevels[2]) return "C类";
    return "D类";
  }

  function normalizeChannelIndustry(value) {
    const industry = String(value || "").trim();
    const aliases = {
      "设计师渠道": "设计师",
      "装修公司渠道": "装修公司",
      "建材商家": "建材卖场",
      "家电商家": "家电",
      "瓷砖店": "瓷砖",
      "卫浴店": "卫浴",
      "灯具店": "灯饰",
      "全屋定制": "定制柜/全屋定制",
      "定制柜": "定制柜/全屋定制",
      "空调新风": "空调/新风"
    };
    if (!industry || customerTypes.includes(industry)) return "";
    return aliases[industry] || industry;
  }

  function normalizeAfterSaleStatus(value) {
    const map = {
      "待送货": notInstalledStatus,
      "待送货安装": notInstalledStatus,
      "未送货": notInstalledStatus,
      "未安装": notInstalledStatus,
      "已成交没有配送": notInstalledStatus,
      "全款交定金，没有尾款": notInstalledStatus,
      "已成交且交完全款": notInstalledStatus,
      "已送货": installedUnpaidStatus,
      "已送货安装": installedUnpaidStatus,
      "已送装没结尾款": installedUnpaidStatus,
      "已经配送，但没收到尾款": installedUnpaidStatus,
      "已安装没有收到尾款": installedUnpaidStatus,
      "已安装，未收到尾款": installedUnpaidStatus,
      "已安装，没有收到尾款": installedUnpaidStatus,
      "售后回访": installedUnpaidStatus,
      "已结尾款": installedPaidStatus,
      "已经配送，已收到尾款": installedPaidStatus,
      "已经配送且已经结尾款": installedPaidStatus,
      "可邀转介绍": installedPaidStatus,
      "已介绍新客户": installedPaidStatus,
      "已安装收到全款": installedPaidStatus,
      "已安装收到尾款": installedPaidStatus,
      "已安装，已收到全款": installedPaidStatus,
      "已安装，已收到尾款": installedPaidStatus,
      "已安装且收到全款": installedPaidStatus,
      "已安装且收到尾款": installedPaidStatus,
      "已安装并收到全款": installedPaidStatus,
      "已安装并收到尾款": installedPaidStatus,
      "已经安装收到全款": installedPaidStatus,
      "已经安装收到尾款": installedPaidStatus,
      "已经安装且收到全款": installedPaidStatus,
      "已经安装且收到尾款": installedPaidStatus,
      "已安装，收到尾款": installedPaidStatus,
      "已安装，收到全款": installedPaidStatus
    };
    const normalized = map[value] || value;
    return afterSaleStatuses.includes(normalized) ? normalized : afterSaleStatuses[0];
  }

  function normalizeAfterSaleIssueStatus(value) {
    const normalized = value === "待处理" ? "处理中" : value;
    return afterSaleIssueStatuses.includes(normalized) ? normalized : afterSaleIssueStatuses[0];
  }

  function hasActiveAfterSaleIssue(record) {
    const status = normalizeAfterSaleIssueStatus(record?.afterSaleIssueStatus);
    return status !== "无售后问题" && status !== "已解决";
  }

  function normalizeSalesShareRatio(value) {
    return salesShareRatios.includes(value) ? value : salesShareRatios[0];
  }

  function normalizeCommissionPoints(value) {
    return commissionPointOptions.includes(value) ? value : commissionPointOptions[0];
  }

  function normalizeOrderChangeStatus(value) {
    const map = {
      "已加单": "升单",
      "加单": "升单",
      "客户反悔": "已改单",
      "待确认": "已改单"
    };
    const normalized = map[value] || value;
    return orderChangeStatuses.includes(normalized) ? normalized : orderChangeStatuses[0];
  }

  function orderChangeNeedsApproval(value) {
    return !orderChangeDirectStatuses.includes(normalizeOrderChangeStatus(value));
  }

  function normalizeDealSource(value) {
    return dealSourceOptions.includes(value) ? value : dealSourceOptions[0];
  }

  function employeeCommissionLocked() {
    return activeRole === "employee";
  }

  function normalizeDealArchiveDraft(draft) {
    if (!draft || typeof draft !== "object" || Array.isArray(draft)) return null;
    return {
      orderAmount: String(draft.orderAmount || ""),
      depositAmount: String(draft.depositAmount || ""),
      salesShareRatio: normalizeSalesShareRatio(draft.salesShareRatio),
      commissionPoints: normalizeCommissionPoints(draft.commissionPoints),
      orderChangeStatus: normalizeOrderChangeStatus(draft.orderChangeStatus)
    };
  }

  function normalizeAfterSaleDraft(draft) {
    if (!draft || typeof draft !== "object" || Array.isArray(draft)) return null;
    return {
      afterSaleStatus: normalizeAfterSaleStatus(draft.afterSaleStatus),
      afterSaleIssueStatus: normalizeAfterSaleIssueStatus(draft.afterSaleIssueStatus)
    };
  }

  function afterSaleAdvice(status) {
    const normalized = normalizeAfterSaleStatus(status);
    const advice = {
      [notInstalledStatus]: "还没有安装，重点盯安装时间和送装安排。",
      [installedUnpaidStatus]: "已经安装，但尾款没收齐，重点跟进尾款。",
      [installedPaidStatus]: "已经安装且收到尾款；如有售后问题，会继续留在售后维护。"
    };
    return advice[normalized] || advice[afterSaleStatuses[0]];
  }

  function amountNumber(value) {
    const number = Number(String(value || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(number) ? number : 0;
  }

  function percentNumber(value) {
    const number = Number(String(value || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(number) ? number / 100 : 0;
  }

  function moneyText(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return "¥0";
    return `¥${number.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
  }

  function dealArchiveAmounts(orderAmount, salesShareRatio, commissionPoints) {
    const shareAmount = amountNumber(orderAmount) * percentNumber(salesShareRatio);
    const commissionAmount = shareAmount * percentNumber(commissionPoints);
    return { shareAmount, commissionAmount };
  }

  function updateDealArchiveAmountViews() {
    const orderAmount = $("#dealOrderAmount")?.value || "";
    const salesShareRatio = normalizeSalesShareRatio($("#dealSalesShareRatio")?.value || "");
    const commissionPoints = normalizeCommissionPoints($("#dealCommissionPoints")?.value || "");
    const { shareAmount, commissionAmount } = dealArchiveAmounts(orderAmount, salesShareRatio, commissionPoints);
    const shareView = $("#dealShareAmountView");
    const commissionView = $("#dealCommissionAmountView");
    if (shareView) shareView.textContent = moneyText(shareAmount);
    if (commissionView) commissionView.textContent = moneyText(commissionAmount);
  }

  function normalizeDealLifecycleStatus(value) {
    return dealLifecycleStatuses.includes(value) ? value : "";
  }

  function dealStatusToAfterSaleStatus(status) {
    const normalized = normalizeDealLifecycleStatus(status);
    if (normalized === "已成交且交完全款") return notInstalledStatus;
    if (normalized === "已送装没结尾款") return installedUnpaidStatus;
    if (normalized === "已经配送且已经结尾款") return installedPaidStatus;
    return notInstalledStatus;
  }

  function closedDealStatusText(record) {
    const saved = normalizeDealLifecycleStatus(record?.dealLifecycleStatus);
    if (saved) return saved;
    const status = normalizeAfterSaleStatus(record?.afterSaleStatus);
    const orderAmount = amountNumber(record?.orderAmount);
    const depositAmount = amountNumber(record?.depositAmount);
    const paidFull = orderAmount > 0 && depositAmount >= orderAmount;
    if (status === installedPaidStatus) return "已经配送且已经结尾款";
    if (status === installedUnpaidStatus) return "已送装没结尾款";
    if (status === notInstalledStatus && paidFull) return "已成交且交完全款";
    if (paidFull) return "已成交且交完全款";
    return "已成交没有配送";
  }

  function afterSaleIssueAdvice(status) {
    const normalized = normalizeAfterSaleIssueStatus(status);
    const advice = {
      "无售后问题": "暂时没有售后问题，保持正常维护。",
      "处理中": "售后正在处理，记得同步进度。",
      "已解决": "问题已解决，可做满意度回访。",
      "需老板处理": "问题较重要，需要老板或主管介入。"
    };
    return advice[normalized] || advice["无售后问题"];
  }

  function normalizeFileNames(names, singleName = "") {
    return (Array.isArray(names) ? names : [])
      .concat(singleName ? [singleName] : [])
      .map((name) => String(name || "").trim())
      .filter(Boolean)
      .filter((name, index, list) => list.indexOf(name) === index);
  }

  function contactTypeLabel(value) {
    const map = {
      customer: "客户信息",
      master: "师傅",
      channel: "异业和渠道"
    };
    return map[value] || "客户信息";
  }

  function isCustomerContactLog(log) {
    return (log.contactType || "customer") === "customer" && !log.storeAnonymous;
  }

  function coerceBuildingNumber(value, fallback = "1栋") {
    const match = String(value || "").match(/(\d{1,2})\s*(栋|幢|号楼|楼)/);
    return match ? `${match[1]}栋` : fallback;
  }

  function coerceUnit(value, fallback = "1单元") {
    const match = String(value || "").match(/(\d{1,2})\s*单元/);
    return match ? `${match[1]}单元` : fallback;
  }

  function buildRoomOptions(floor) {
    const floors = floor
      ? [String(floor)]
      : Array.from({ length: 33 }, (_, index) => String(index + 1));
    return floors.flatMap((selectedFloor) => (
      Array.from({ length: 8 }, (_, index) => {
        const roomNo = String(index + 1).padStart(2, "0");
        return `${selectedFloor}${roomNo}室`;
      })
    ));
  }

  function receptionBadgeClass(reception) {
    if (reception === "逛一圈就走") return "warn";
    if (["有意向", "做了预算，下次再来"].includes(reception)) return "info";
    if (reception === "已成交") return "good";
    if (["有业主", "师傅和业主都在"].includes(reception)) return "good";
    if (["有师傅"].includes(reception)) return "info";
    if (["没有开门"].includes(reception)) return "warn";
    return "info";
  }

  function displayReceptionResult(log) {
    if (log?.visitType === "门店接待") {
      return normalizeStoreVisitResult(log.storeResult || storeVisitResultFromStage(log.wechatStage));
    }
    return log?.reception || "";
  }

  function contactLevelBadgeClass(level) {
    if (level === "VIP等级已经介绍客户成交") return "good";
    if (level === "会介绍客户") return "info";
    if (level === "常沟通没介绍过客户") return "info";
    return "warn";
  }

  function renovationBadgeClass(stage) {
    if (["拆改", "水电", "瓷砖"].includes(stage)) return "good";
    if (["木工", "油漆", "吊顶", "定制安装", "软装进场"].includes(stage)) return "info";
    return "warn";
  }

  function buildSampleWechatProof(log, employee) {
    const fileName = `微信聊天截图-${log.customer || "客户"}-${displayBuilding(log)}.png`;
    return {
      isSample: true,
      fileName,
      fileNames: [fileName],
      uploadTime: new Date(log.timestamp).toISOString(),
      customerWechat: `${log.customer || "客户"} · 软装咨询`,
      stage: normalizeCustomerFollowStage(log.wechatStage || (log.reception === "没有开门" ? "没有到过店" : "已到过店")),
      summary: "客户询问客厅沙发、餐桌和全屋软装搭配，员工已发送门店位置和产品参考图。",
      nextStep: "明天 10:30 电话确认到店时间，并补发报价区间。",
      messages: [
        { from: "staff", text: "您好，我是刚才拜访的家具顾问，给您发一下门店位置和案例图。", time: formatTime(log.timestamp) },
        { from: "customer", text: "好的，我主要想看看沙发和餐桌，预算中等。", time: formatTime(log.timestamp) },
        { from: "staff", text: "收到，我先按您家面积整理两套方案，明天给您发参考。", time: formatTime(log.timestamp) }
      ],
      note: "这是系统内置样板，用来演示员工上传微信聊天截图后老板能看到哪些信息。"
    };
  }

  function rawDraftVisitMode(draft) {
    if (draft?.visitType === "售后维护") return "afterSale";
    if (draft?.visitType === "已安装收尾款") return "installedPaid";
    if (draft?.visitType === "已成交") return "closed";
    if (draft?.visitType === "门店接待") return "store";
    return draft?.visitType === "老客户回访" ? "return" : "new";
  }

  function draftTimeValue(draft) {
    const time = new Date(draft?.updatedAt || draft?.createdAt || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  function compactArrayValue(first, second) {
    return []
      .concat(Array.isArray(first) ? first : (first ? [first] : []))
      .concat(Array.isArray(second) ? second : (second ? [second] : []))
      .map((value) => String(value || "").trim())
      .filter(Boolean)
      .filter((value, index, list) => list.indexOf(value) === index);
  }

  function returnDraftKey(draft) {
    if (rawDraftVisitMode(draft) !== "return") return "";
    const contactType = draft.contactType || "customer";
    const fallbackIdentity = [
      contactType,
      draft.phone,
      draft.wechatName,
      draft.customer,
      draft.property,
      draft.buildingNumber,
      draft.unit,
      draft.room
    ].map((value) => String(value || "").trim()).filter(Boolean).join("|");
    const identity = draft.oldCustomerLogId || fallbackIdentity;
    return identity ? `${draft.employeeId || ""}|return|${contactType}|${identity}` : "";
  }

  function mergeDraftInto(target, source) {
    Object.keys(source || {}).forEach((key) => {
      if (["id"].includes(key)) return;
      const targetValue = target[key];
      const sourceValue = source[key];
      if (Array.isArray(targetValue) || Array.isArray(sourceValue)) {
        const merged = compactArrayValue(targetValue, sourceValue);
        if (merged.length) target[key] = merged;
        return;
      }
      if ((targetValue === "" || targetValue === undefined || targetValue === null) && sourceValue !== "" && sourceValue !== undefined && sourceValue !== null) {
        target[key] = sourceValue;
      }
    });
    if (source.createdAt && (!target.createdAt || draftTimeValue({ createdAt: source.createdAt }) < draftTimeValue({ createdAt: target.createdAt }))) {
      target.createdAt = source.createdAt;
    }
    if (source.updatedAt && draftTimeValue({ updatedAt: source.updatedAt }) > draftTimeValue({ updatedAt: target.updatedAt })) {
      target.updatedAt = source.updatedAt;
    }
    target.status = "draft";
  }

  function compactReturnDraftList(drafts, preferredId = "") {
    const groups = new Map();
    drafts.forEach((draft) => {
      const key = returnDraftKey(draft);
      if (!key) return;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(draft);
    });

    const keepIds = new Set(drafts.map((draft) => draft.id));
    const replacementIds = new Map();
    let changed = false;

    groups.forEach((list) => {
      if (list.length < 2) return;
      list.sort((a, b) => {
        if (a.id === preferredId) return -1;
        if (b.id === preferredId) return 1;
        return draftTimeValue(b) - draftTimeValue(a);
      });
      const kept = list[0];
      list.slice(1).forEach((duplicate) => {
        mergeDraftInto(kept, duplicate);
        keepIds.delete(duplicate.id);
        replacementIds.set(duplicate.id, kept.id);
        changed = true;
      });
    });

    return {
      drafts: changed ? drafts.filter((draft) => keepIds.has(draft.id)) : drafts,
      changed,
      replacementIds
    };
  }

  function buildTrackingSampleLogs() {
    return [
      {
        id: "log-history-zhang-1",
        employeeId: "emp-chen",
        timestamp: daysAgo(24, 10, 20),
        property: "国贸 SOHO",
        buildingNumber: "9栋",
        unit: "2单元",
        building: "国贸 SOHO 9栋2单元",
        customer: "张经理",
        phone: "13811112222",
        reception: "有师傅",
        result: "拆改",
        customerType: "D类",
        location: "9栋2单元 18 层",
        floor: "18",
        room: "1801室",
        photos: 1,
        duration: 15,
        note: "刚开始拆改，先建档，客户说后面再看办公家具。"
      },
      {
        id: "log-history-zhang-2",
        employeeId: "emp-chen",
        timestamp: daysAgo(10, 15, 30),
        property: "国贸 SOHO",
        buildingNumber: "9栋",
        unit: "2单元",
        building: "国贸 SOHO 9栋2单元",
        customer: "张经理",
        phone: "13811112222",
        reception: "有业主",
        result: "瓷砖",
        customerType: "B类",
        location: "9栋2单元 18 层",
        floor: "18",
        room: "1801室",
        photos: 2,
        duration: 24,
        note: "客户开始关注会议桌尺寸，希望装修后期再报价。"
      },
      {
        id: "log-history-wang-1",
        employeeId: "emp-lin",
        timestamp: daysAgo(17, 11, 5),
        property: "合生汇公寓",
        buildingNumber: "3栋",
        unit: "1单元",
        building: "合生汇公寓 3栋1单元",
        customer: "王女士",
        phone: "13922223333",
        reception: "有业主",
        result: "水电",
        customerType: "C类",
        location: "3栋1单元大堂",
        floor: "3",
        room: "0302室",
        photos: 1,
        duration: 18,
        note: "水电阶段，客户想要北欧风，预算还没确定。"
      },
      {
        id: "log-sample-yang-1",
        employeeId: "emp-chen",
        timestamp: daysAgo(21, 9, 40),
        property: "世贸天阶",
        buildingNumber: "6栋",
        unit: "1单元",
        building: "世贸天阶 6栋1单元",
        customer: "杨女士",
        phone: "13710002001",
        reception: "有业主",
        result: "水电",
        customerType: "D类",
        wechatAdded: "有",
        wechatName: "杨女士新家",
        wechatStage: "已加微信",
        location: "6栋1单元 12 层",
        floor: "12",
        room: "1202室",
        photos: 2,
        photoNames: ["世贸天阶-杨女士-门牌.jpg", "世贸天阶-杨女士-现场.jpg"],
        duration: 18,
        note: "水电刚开始，先记录户型和联系方式，提醒后期柜体阶段再重点跟进。"
      },
      {
        id: "log-sample-yang-2",
        employeeId: "emp-chen",
        timestamp: daysAgo(6, 16, 5),
        property: "世贸天阶",
        buildingNumber: "6栋",
        unit: "1单元",
        building: "世贸天阶 6栋1单元",
        customer: "杨女士",
        phone: "13710002001",
        reception: "有业主",
        result: "木工",
        customerType: "B类",
        wechatAdded: "有",
        wechatName: "杨女士新家",
        wechatStage: "已发方案",
        wechatFileName: "微信聊天截图-杨女士-方案沟通.png",
        location: "6栋1单元 12 层",
        floor: "12",
        room: "1202室",
        photos: 3,
        photoNames: ["杨女士-木工现场1.jpg", "杨女士-木工现场2.jpg", "杨女士-户型.jpg"],
        duration: 26,
        note: "木工阶段，客户开始问餐桌、沙发和主卧床，已发基础款案例。"
      },
      {
        id: "log-sample-he-a",
        employeeId: "emp-chen",
        timestamp: daysAgo(2, 10, 25),
        property: "华贸公寓",
        buildingNumber: "11栋",
        unit: "1单元",
        building: "华贸公寓 11栋1单元",
        customer: "何女士",
        phone: "13610002002",
        reception: "师傅和业主都在",
        result: "定制安装",
        customerType: "A类",
        wechatAdded: "有",
        wechatName: "何女士软装",
        wechatStage: "已约到店",
        wechatAvatarFileName: "微信头像-何女士.png",
        wechatFileName: "微信聊天截图-何女士-约到店.png",
        location: "11栋1单元 9 层",
        floor: "9",
        room: "0901室",
        photos: 4,
        photoNames: ["何女士-客厅.jpg", "何女士-主卧.jpg", "何女士-餐厅.jpg", "何女士-门牌.jpg"],
        duration: 35,
        note: "柜子安装中，客户周末到店看沙发和餐桌，属于重点跟进。"
      },
      {
        id: "log-sample-luo-c",
        employeeId: "emp-chen",
        timestamp: daysAgo(4, 14, 45),
        property: "万科城市花园",
        buildingNumber: "5栋",
        unit: "2单元",
        building: "万科城市花园 5栋2单元",
        customer: "罗先生",
        phone: "13510002003",
        reception: "有师傅",
        result: "瓷砖",
        customerType: "C类",
        wechatAdded: "没有",
        location: "5栋2单元 7 层",
        floor: "7",
        room: "0703室",
        photos: 2,
        photoNames: ["罗先生-瓷砖现场.jpg", "罗先生-门牌.jpg"],
        duration: 14,
        note: "瓷砖阶段，师傅说业主下周会来现场，先记为普通跟进。"
      },
      {
        id: "log-sample-qin-a",
        employeeId: "emp-chen",
        timestamp: daysAgo(1, 17, 10),
        property: "远洋国际中心",
        buildingNumber: "4栋",
        unit: "2单元",
        building: "远洋国际中心 4栋2单元",
        customer: "秦总",
        phone: "13910002004",
        reception: "有业主",
        result: "软装进场",
        customerType: "A类",
        wechatAdded: "有",
        wechatName: "秦总办公室",
        wechatStage: "等待回复",
        location: "4栋2单元 20 层",
        floor: "20",
        room: "2008室",
        photos: 5,
        photoNames: ["秦总-办公区1.jpg", "秦总-会议室.jpg", "秦总-前台.jpg", "秦总-门牌.jpg", "秦总-平面.jpg"],
        duration: 42,
        note: "办公室软装进场，客户需要会议桌、洽谈椅和前台沙发报价。"
      },
      {
        id: "log-sample-ma-d",
        employeeId: "emp-chen",
        timestamp: daysAgo(3, 12, 20),
        property: "龙湖天街",
        buildingNumber: "7栋",
        unit: "3单元",
        building: "龙湖天街 7栋3单元",
        customer: "马先生",
        phone: "",
        reception: "没有开门",
        result: "暂不清楚",
        customerType: "D类",
        wechatAdded: "没有",
        location: "7栋3单元 5 层",
        floor: "5",
        room: "0505室",
        photos: 1,
        photoNames: ["马先生-门牌.jpg"],
        duration: 0,
        note: "没有开门，先记录房号，后续再回访。"
      },
      {
        id: "log-sample-tang-b",
        employeeId: "emp-lin",
        timestamp: daysAgo(5, 15, 15),
        property: "中粮广场",
        buildingNumber: "2栋",
        unit: "1单元",
        building: "中粮广场 2栋1单元",
        customer: "唐女士",
        phone: "13810002005",
        reception: "有业主",
        result: "油漆",
        customerType: "B类",
        wechatAdded: "有",
        wechatName: "唐女士",
        location: "2栋1单元 15 层",
        floor: "15",
        room: "1506室",
        photos: 3,
        duration: 28,
        note: "油漆阶段，客户对儿童房床和书桌感兴趣。"
      },
      {
        id: "log-sample-xu-invalid",
        employeeId: "emp-wu",
        timestamp: daysAgo(7, 11, 50),
        property: "金融街中心",
        buildingNumber: "1栋",
        unit: "1单元",
        building: "金融街中心 1栋1单元",
        customer: "许先生",
        phone: "13710002006",
        reception: "有业主",
        result: "已入住",
        customerType: "D类",
        wechatAdded: "没有",
        location: "1栋1单元 3 层",
        floor: "3",
        room: "0308室",
        photos: 1,
        duration: 10,
        note: "客户反馈已经买了别家家具，可用于测试无效客户申请。"
      }
    ];
  }

  function buildResourceSampleLogs() {
    return [
      {
        id: "log-resource-master-wood-li",
        employeeId: "emp-chen",
        timestamp: daysAgo(5, 16, 10),
        visitType: "新增拜访",
        contactType: "master",
        customer: "李师傅",
        phone: "13870001001",
        customerType: "木工",
        contactLevel: "会介绍客户",
        wechatAdded: "有",
        wechatName: "李师傅木工",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "常在国贸附近施工，愿意帮忙介绍快到定制安装阶段的客户。"
      },
      {
        id: "log-resource-master-electric-wang",
        employeeId: "emp-chen",
        timestamp: daysAgo(8, 11, 35),
        visitType: "新增拜访",
        contactType: "master",
        customer: "王电工",
        phone: "13870001002",
        customerType: "水电工",
        contactLevel: "常沟通没介绍过客户",
        wechatAdded: "有",
        wechatName: "王工水电",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "熟悉多个新楼盘水电进度，关系还在培养。"
      },
      {
        id: "log-resource-master-installer-zhao",
        employeeId: "emp-chen",
        timestamp: daysAgo(14, 14, 0),
        visitType: "新增拜访",
        contactType: "master",
        customer: "赵安装",
        phone: "13870001003",
        customerType: "安装师傅",
        contactLevel: "少联系",
        wechatAdded: "没有",
        wechatName: "",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "偶尔碰到，暂时先做基础资料。"
      },
      {
        id: "log-resource-channel-designer-chen",
        employeeId: "emp-chen",
        timestamp: daysAgo(3, 10, 45),
        visitType: "新增拜访",
        contactType: "channel",
        customer: "陈设计",
        phone: "13870002001",
        customerType: "设计师",
        contactLevel: "VIP等级已经介绍客户成交",
        wechatAdded: "有",
        wechatName: "陈设计软装",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "已经介绍过客户成交，属于重点维护渠道。"
      },
      {
        id: "log-resource-channel-decoration-sun",
        employeeId: "emp-chen",
        timestamp: daysAgo(9, 17, 20),
        visitType: "新增拜访",
        contactType: "channel",
        customer: "孙经理",
        phone: "13870002002",
        customerType: "装修公司",
        contactLevel: "会介绍客户",
        wechatAdded: "有",
        wechatName: "孙经理装修",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "公司有多个工地，愿意按客户进度推荐家具。"
      },
      {
        id: "log-resource-channel-material-zhou",
        employeeId: "emp-chen",
        timestamp: daysAgo(16, 13, 15),
        visitType: "新增拜访",
        contactType: "channel",
        customer: "周姐",
        phone: "13870002003",
        customerType: "瓷砖",
        contactLevel: "常沟通没介绍过客户",
        wechatAdded: "有",
        wechatName: "周姐瓷砖",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "瓷砖店老板，能接触到装修中期客户，后续需要持续沟通。"
      },
      {
        id: "log-resource-master-paint-huang",
        employeeId: "emp-chen",
        timestamp: daysAgo(2, 18, 10),
        visitType: "新增拜访",
        contactType: "master",
        customer: "黄油漆",
        phone: "13870001004",
        customerType: "油漆工",
        contactLevel: "会介绍客户",
        wechatAdded: "有",
        wechatName: "黄师傅油漆",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "经常在油漆阶段现场，适合提醒员工重点维护。"
      },
      {
        id: "log-resource-master-foreman-guo",
        employeeId: "emp-chen",
        timestamp: daysAgo(6, 12, 40),
        visitType: "新增拜访",
        contactType: "master",
        customer: "郭工长",
        phone: "13870001005",
        customerType: "工长",
        contactLevel: "VIP等级已经介绍客户成交",
        wechatAdded: "有",
        wechatName: "郭工长",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "已介绍过两套客户成交，属于重点师傅资源。"
      },
      {
        id: "log-resource-channel-agent-liu",
        employeeId: "emp-chen",
        timestamp: daysAgo(4, 9, 55),
        visitType: "新增拜访",
        contactType: "channel",
        customer: "刘中介",
        phone: "13870002004",
        customerType: "房产中介",
        contactLevel: "少联系",
        wechatAdded: "有",
        wechatName: "刘中介",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "手上有二手房成交客户，暂时联系不多。"
      },
      {
        id: "log-resource-channel-appliance-wu",
        employeeId: "emp-chen",
        timestamp: daysAgo(11, 15, 5),
        visitType: "新增拜访",
        contactType: "channel",
        customer: "吴姐家电",
        phone: "13870002005",
        customerType: "家电",
        contactLevel: "常沟通没介绍过客户",
        wechatAdded: "有",
        wechatName: "吴姐家电",
        wechatNameSource: "样板资料",
        result: "暂不清楚",
        reception: "",
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        photos: 0,
        note: "家电客户多在装修后期，可用于测试异业检索。"
      }
    ];
  }

  function buildSampleDrafts() {
    return [
      {
        id: "draft-sample-customer-zhou",
        employeeId: "emp-chen",
        createdAt: daysAgo(0, 9, 10),
        updatedAt: minutesAgo(18),
        status: "draft",
        visitType: "新增拜访",
        contactType: "customer",
        property: "世贸天阶",
        buildingNumber: "7栋",
        unit: "2单元",
        building: "世贸天阶 7栋2单元",
        room: "1602室",
        floor: "16",
        customer: "周太太",
        phone: "13830003001",
        reception: "有业主",
        result: "瓷砖",
        customerType: "B类",
        wechatAdded: "有",
        wechatName: "周太太新房",
        wechatNameSource: "员工手动填写",
        wechatStage: "已加微信",
        location: "7栋2单元 16 层",
        locationSource: "房号下拉选择，可附加定位坐标",
        photos: 2,
        photoNames: ["周太太-门牌.jpg", "周太太-客厅瓷砖.jpg"],
        duration: 20,
        durationSource: "员工下拉选择",
        note: "客户想看现代简约沙发和餐桌，预算中等，等木工结束后重点跟进。"
      },
      {
        id: "draft-sample-return-zhang",
        employeeId: "emp-chen",
        createdAt: daysAgo(0, 10, 35),
        updatedAt: minutesAgo(32),
        status: "draft",
        visitType: "老客户回访",
        oldCustomerLogId: "log-history-zhang-2",
        contactType: "customer",
        property: "国贸 SOHO",
        buildingNumber: "9栋",
        unit: "2单元",
        building: "国贸 SOHO 9栋2单元",
        room: "1801室",
        floor: "18",
        customer: "张经理",
        phone: "13811112222",
        reception: "有业主",
        result: "定制安装",
        customerType: "A类",
        wechatAdded: "有",
        wechatName: "张经理办公家具",
        wechatNameSource: "老客户资料带出",
        wechatStage: "已约到店",
        location: "9栋2单元 18 层",
        locationSource: "老客户回访带出",
        photos: 1,
        photoNames: ["张经理-定制安装现场.jpg"],
        duration: 30,
        durationSource: "员工下拉选择",
        note: "回访时客户说柜体快装完，周五下午可能到店看会议桌。"
      },
      {
        id: "draft-sample-customer-chen",
        employeeId: "emp-chen",
        createdAt: daysAgo(0, 11, 20),
        updatedAt: minutesAgo(47),
        status: "draft",
        visitType: "新增拜访",
        contactType: "customer",
        property: "万科城市花园",
        buildingNumber: "4栋",
        unit: "1单元",
        building: "万科城市花园 4栋1单元",
        room: "0808室",
        floor: "8",
        customer: "陈先生",
        phone: "",
        reception: "没有开门",
        result: "暂不清楚",
        customerType: "D类",
        wechatAdded: "没有",
        location: "4栋1单元 8 层",
        locationSource: "房号下拉选择，可附加定位坐标",
        photos: 1,
        photoNames: ["陈先生-门牌.jpg"],
        duration: 0,
        durationSource: "员工下拉选择",
        note: "没有开门，只记录门牌，后续重新扫楼。"
      },
      {
        id: "draft-sample-customer-liang",
        employeeId: "emp-chen",
        createdAt: daysAgo(0, 13, 5),
        updatedAt: minutesAgo(64),
        status: "draft",
        visitType: "新增拜访",
        contactType: "customer",
        property: "华贸公寓",
        buildingNumber: "12栋",
        unit: "2单元",
        building: "华贸公寓 12栋2单元",
        room: "1103室",
        floor: "11",
        customer: "梁小姐",
        phone: "13930003002",
        reception: "有业主",
        result: "软装进场",
        customerType: "A类",
        wechatAdded: "有",
        wechatName: "梁小姐",
        wechatNameSource: "头像截图识别样板",
        wechatAvatarFileName: "微信头像-梁小姐.png",
        wechatFileName: "微信聊天截图-梁小姐-软装.png",
        wechatStage: "已发方案",
        location: "12栋2单元 11 层",
        locationSource: "房号下拉选择，可附加定位坐标",
        photos: 4,
        photoNames: ["梁小姐-客厅.jpg", "梁小姐-餐厅.jpg", "梁小姐-卧室.jpg", "梁小姐-门牌.jpg"],
        duration: 40,
        durationSource: "员工下拉选择",
        note: "软装进场，客户明确要看沙发、茶几和餐边柜，优先级高。"
      },
      {
        id: "draft-sample-master-huang",
        employeeId: "emp-chen",
        createdAt: daysAgo(0, 14, 15),
        updatedAt: minutesAgo(82),
        status: "draft",
        visitType: "新增拜访",
        contactType: "master",
        customer: "黄泥工",
        phone: "13830003003",
        customerType: "瓦工",
        contactLevel: "会介绍客户",
        wechatAdded: "有",
        wechatName: "黄师傅瓦工",
        wechatNameSource: "员工手动填写",
        wechatStage: "已加微信",
        result: "暂不清楚",
        reception: "",
        location: "",
        photos: 0,
        photoNames: [],
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        note: "瓷砖阶段经常在现场，愿意介绍准备看家具的业主。"
      },
      {
        id: "draft-sample-channel-wu",
        employeeId: "emp-chen",
        createdAt: daysAgo(0, 15, 40),
        updatedAt: minutesAgo(105),
        status: "draft",
        visitType: "新增拜访",
        contactType: "channel",
        customer: "吴设计",
        phone: "13830003004",
        customerType: "设计师",
        contactLevel: "常沟通没介绍过客户",
        wechatAdded: "有",
        wechatName: "吴设计",
        wechatNameSource: "员工手动填写",
        wechatStage: "等待回复",
        result: "暂不清楚",
        reception: "",
        location: "",
        photos: 0,
        photoNames: [],
        duration: 0,
        durationSource: "师傅/异业等级记录，无需填写现场停留",
        note: "设计师手上有几个高端住宅客户，先建立关系，后续持续沟通。"
      }
    ];
  }

  function buildSeedState() {
    return {
      rules: {
        photoRequired: true,
        minPhotos: 1,
        gapMinutes: 120
      },
      employees: [
        {
          id: "emp-chen",
          name: "陈磊",
          region: "东区",
          target: 10,
          phone: "13800001001",
          status: "working",
          map: { x: 24, y: 38, label: "国贸商圈" },
          route: ["国贸 SOHO", "建外写字楼", "世贸天阶"]
        },
        {
          id: "emp-lin",
          name: "林晓",
          region: "南区",
          target: 9,
          phone: "13800001002",
          status: "working",
          map: { x: 54, y: 58, label: "大望路" },
          route: ["合生汇", "金地中心", "百子湾社区"]
        },
        {
          id: "emp-wu",
          name: "吴越",
          region: "西区",
          target: 8,
          phone: "13800001003",
          status: "paused",
          map: { x: 72, y: 35, label: "金融街" },
          route: ["金融街中心", "月坛南街", "阜成门外"]
        },
        {
          id: "emp-zhao",
          name: "赵敏",
          region: "东区",
          target: 10,
          phone: "13800001004",
          status: "working",
          map: { x: 42, y: 24, label: "三元桥" },
          route: ["凤凰汇", "霄云路", "亮马桥"]
        }
      ],
      drafts: buildSampleDrafts(),
      invalidRequests: [],
      orderChangeRequests: [],
      closedCustomers: [],
      changeLogs: [],
      logs: [
        {
          id: "log-1",
          employeeId: "emp-chen",
          timestamp: minutesAgo(11),
          property: "国贸 SOHO",
          buildingNumber: "9栋",
          unit: "2单元",
          building: "国贸 SOHO 9栋2单元",
          customer: "张经理",
          phone: "13811112222",
          reception: "有业主",
          result: "油漆",
          customerType: "A类",
          location: "9栋2单元 18 层",
          floor: "18",
          room: "1801室",
          photos: 3,
          duration: 22,
          note: "墙面油漆阶段，客户准备更换办公区软装，关注沙发和会议桌。"
        },
        {
          id: "log-2",
          employeeId: "emp-lin",
          timestamp: minutesAgo(28),
          property: "合生汇公寓",
          buildingNumber: "3栋",
          unit: "1单元",
          building: "合生汇公寓 3栋1单元",
          customer: "王女士",
          phone: "13922223333",
          reception: "有业主",
          result: "瓷砖",
          customerType: "B类",
          location: "3栋1单元大堂",
          floor: "3",
          room: "0302室",
          photos: 2,
          duration: 16,
          note: "新房交付，预计本周末到店看样。"
        },
        {
          id: "log-3",
          employeeId: "emp-zhao",
          timestamp: minutesAgo(47),
          property: "凤凰汇办公楼",
          buildingNumber: "5栋",
          unit: "2单元",
          building: "凤凰汇办公楼 5栋2单元",
          customer: "李总",
          phone: "13633334444",
          reception: "师傅和业主都在",
          result: "拆改",
          customerType: "A类",
          location: "B1 停车场入口",
          floor: "1",
          room: "0108室",
          photos: 1,
          duration: 12,
          note: "先要儿童房方案，明天下午回访。"
        },
        {
          id: "log-4",
          employeeId: "emp-wu",
          timestamp: minutesAgo(133),
          property: "金融街中心",
          buildingNumber: "1栋",
          unit: "1单元",
          building: "金融街中心 1栋1单元",
          customer: "前台",
          phone: "",
          reception: "没有开门",
          result: "暂不清楚",
          customerType: "D类",
          location: "",
          floor: "1",
          room: "0101室",
          photos: 0,
          duration: 5,
          note: "需要工作日预约物业。"
        },
        {
          id: "log-5",
          employeeId: "emp-chen",
          timestamp: minutesAgo(165),
          property: "建外写字楼",
          buildingNumber: "2栋",
          unit: "2单元",
          building: "建外写字楼 2栋2单元",
          customer: "刘工",
          phone: "13744445555",
          reception: "有师傅",
          result: "木工",
          customerType: "B类",
          location: "北门",
          floor: "1",
          room: "0106室",
          photos: 2,
          duration: 18,
          note: "办公室搬迁，预算待确认。"
        },
        {
          id: "log-6",
          employeeId: "emp-lin",
          timestamp: minutesAgo(215),
          property: "金地中心",
          buildingNumber: "8栋",
          unit: "1单元",
          building: "金地中心 8栋1单元",
          customer: "周先生",
          phone: "13555556666",
          reception: "没有开门",
          result: "已入住",
          customerType: "C类",
          location: "一层商铺",
          floor: "1",
          room: "0103室",
          photos: 1,
          duration: 8,
          note: "已签其他品牌。"
        }
      ]
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return normalizeState(JSON.parse(saved));
      }
    } catch (error) {
      console.warn("Cannot parse saved state", error);
    }
    return normalizeState(buildSeedState());
  }

  function sampleClosedRecordFromLog(log, sample) {
    if (!log || !isCustomerContactLog(log)) return null;
    log.wechatStage = "已成交";
    log.customerType = "A类";
    return {
      id: sample.id,
      customerKey: customerRecordKey(log),
      employeeId: log.employeeId,
      customer: log.customer,
      phone: log.phone || "",
      building: displayBuilding(log),
      room: displayRoom(log),
      sourceLogId: log.id,
      result: log.result || "",
      wechatName: log.wechatName || "",
      customerFollowStage: "已成交",
      storeReceptionStatus: "已到过店",
      budgetStatus: "已做过预算",
      note: sample.note || log.note || "样板成交客户，用来演示售后维护效果。",
      closedAt: sample.closedAt,
      afterSaleStatus: sample.afterSaleStatus,
      afterSaleIssueStatus: sample.afterSaleIssueStatus,
      afterSaleUpdatedAt: sample.afterSaleUpdatedAt || sample.closedAt,
      installedPaidAt: sample.installedPaidAt || (normalizeAfterSaleStatus(sample.afterSaleStatus) === installedPaidStatus ? (sample.afterSaleUpdatedAt || sample.closedAt) : ""),
      dealImageNames: sample.dealImageNames || [],
      orderAmount: sample.orderAmount || "",
      depositAmount: sample.depositAmount || "",
      salesShareRatio: sample.salesShareRatio || "10%",
      commissionPoints: sample.commissionPoints || "1点",
      orderChangeStatus: sample.orderChangeStatus || "没有改单",
      dealSource: normalizeDealSource(sample.dealSource),
      status: "closed"
    };
  }

  function ensureSampleClosedCustomers(nextState) {
    const existingIds = new Set(nextState.closedCustomers.map((record) => record.id));
    const samples = [
      {
        id: "closed-sample-he-a",
        logId: "log-sample-he-a",
        note: "样板成交客户，用来演示成交区的查看效果。",
        closedAt: daysAgo(1, 18, 20),
        afterSaleStatus: installedUnpaidStatus,
        afterSaleIssueStatus: "无售后问题",
        dealImageNames: ["何女士-成交合同.jpg", "何女士-定金收款截图.jpg"],
        orderAmount: "56800",
        depositAmount: "10000",
        salesShareRatio: "50%",
        commissionPoints: "3点",
        dealSource: "客户介绍",
        orderChangeStatus: "没有改单"
      },
      {
        id: "closed-sample-zhang",
        logId: "log-1",
        note: "办公区家具已下单，客户等会议桌和沙发送装。",
        closedAt: daysAgo(0, 11, 40),
        afterSaleStatus: notInstalledStatus,
        afterSaleIssueStatus: "无售后问题",
        dealImageNames: ["张经理-订单确认.jpg", "张经理-定金截图.jpg"],
        orderAmount: "88888",
        depositAmount: "30000",
        salesShareRatio: "70%",
        commissionPoints: "5点",
        dealSource: "空白客户",
        orderChangeStatus: "没有改单"
      },
      {
        id: "closed-sample-yang",
        logId: "log-sample-yang-2",
        note: "客户已改一次餐桌尺寸，等工厂确认后安排送货。",
        closedAt: daysAgo(2, 16, 30),
        afterSaleStatus: notInstalledStatus,
        afterSaleIssueStatus: "处理中",
        dealImageNames: ["杨女士-合同.jpg", "杨女士-改单记录.jpg"],
        orderAmount: "42600",
        depositAmount: "15000",
        salesShareRatio: "40%",
        commissionPoints: "4点",
        dealSource: "装修公司介绍",
        orderChangeStatus: "已改单"
      },
      {
        id: "closed-sample-qin",
        logId: "log-sample-qin-a",
        note: "办公家具已送货，客户反馈一把洽谈椅有轻微划痕。",
        closedAt: daysAgo(3, 15, 10),
        afterSaleStatus: installedUnpaidStatus,
        afterSaleIssueStatus: "处理中",
        dealImageNames: ["秦总-收款截图.jpg", "秦总-送货现场.jpg"],
        orderAmount: "96300",
        depositAmount: "50000",
        salesShareRatio: "60%",
        commissionPoints: "6点",
        dealSource: "异业介绍",
        orderChangeStatus: "升单"
      },
      {
        id: "closed-sample-luo-installed",
        logId: "log-sample-luo-c",
        note: "客厅沙发和餐桌已安装，客户尾款已结清，放入最终归档方便以后查找。",
        closedAt: daysAgo(4, 17, 35),
        afterSaleStatus: installedPaidStatus,
        afterSaleIssueStatus: "无售后问题",
        installedPaidAt: daysAgo(0, 15, 50),
        dealImageNames: ["罗先生-安装完成.jpg", "罗先生-全款截图.jpg", "罗先生-客厅效果.jpg"],
        orderAmount: "64800",
        depositAmount: "64800",
        salesShareRatio: "50%",
        commissionPoints: "4点",
        dealSource: "空白客户",
        orderChangeStatus: "没有改单"
      },
      {
        id: "closed-sample-liu",
        logId: "log-5",
        note: "办公室搬迁家具已安装完成，尾款结清；客户反馈有一处桌角磕碰，仍要在售后维护里处理。",
        closedAt: daysAgo(5, 18, 0),
        afterSaleStatus: installedPaidStatus,
        afterSaleIssueStatus: "处理中",
        installedPaidAt: daysAgo(1, 16, 20),
        dealImageNames: ["刘工-尾款截图.jpg", "刘工-安装完成.jpg"],
        orderAmount: "35200",
        depositAmount: "12000",
        salesShareRatio: "30%",
        commissionPoints: "3点",
        dealSource: "师傅介绍",
        orderChangeStatus: "已换货"
      }
    ];

    samples.forEach((sample) => {
      if (existingIds.has(sample.id)) return;
      const log = nextState.logs.find((item) => item.id === sample.logId);
      const record = sampleClosedRecordFromLog(log, sample);
      if (record) {
        nextState.closedCustomers.push(record);
        existingIds.add(record.id);
      }
    });
  }

  function normalizeState(nextState) {
    if (!nextState || !Array.isArray(nextState.logs)) nextState = buildSeedState();
    if (!Array.isArray(nextState.drafts)) nextState.drafts = [];
    if (!Array.isArray(nextState.invalidRequests)) nextState.invalidRequests = [];
    if (!Array.isArray(nextState.orderChangeRequests)) nextState.orderChangeRequests = [];
    if (!Array.isArray(nextState.closedCustomers)) nextState.closedCustomers = [];
    if (!Array.isArray(nextState.changeLogs)) nextState.changeLogs = [];
    const logIds = new Set(nextState.logs.map((log) => log.id));
    [...buildTrackingSampleLogs(), ...buildResourceSampleLogs()].forEach((log) => {
      if (!logIds.has(log.id)) {
        nextState.logs.push(log);
      }
    });
    const draftIds = new Set(nextState.drafts.map((draft) => draft.id));
    const submittedDraftIds = new Set(nextState.logs.map((log) => log.draftId).filter(Boolean));
    buildSampleDrafts().forEach((draft) => {
      if (!draftIds.has(draft.id) && !submittedDraftIds.has(draft.id)) {
        nextState.drafts.push(draft);
      }
    });
    nextState.invalidRequests.forEach((request) => {
      if (!request.status) request.status = "pending";
      if (!request.createdAt) request.createdAt = new Date().toISOString();
    });
    nextState.orderChangeRequests.forEach((request) => {
      if (!request.id) request.id = `order-change-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      if (!request.status) request.status = "pending";
      if (!request.createdAt) request.createdAt = new Date().toISOString();
      request.currentStatus = normalizeOrderChangeStatus(request.currentStatus);
      request.requestedStatus = normalizeOrderChangeStatus(request.requestedStatus);
      request.archiveFields = normalizeDealArchiveDraft(request.archiveFields) || {};
    });
    nextState.closedCustomers.forEach((record) => {
      if (!record.id) record.id = `closed-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      if (!record.closedAt) record.closedAt = new Date().toISOString();
      if (!record.status) record.status = "closed";
      record.afterSaleStatus = normalizeAfterSaleStatus(record.afterSaleStatus);
      record.afterSaleIssueStatus = normalizeAfterSaleIssueStatus(record.afterSaleIssueStatus);
      record.dealLifecycleStatus = normalizeDealLifecycleStatus(record.dealLifecycleStatus);
      if (!record.afterSaleUpdatedAt) record.afterSaleUpdatedAt = record.closedAt;
      if (record.installedPaidAt) record.afterSaleStatus = installedPaidStatus;
      if (record.id === "closed-sample-liu" && record.afterSaleStatus === "已经配送，已收到尾款" && !record.installedPaidAt) {
        record.afterSaleStatus = installedPaidStatus;
      }
      if (record.id === "closed-sample-liu" && record.afterSaleStatus === installedPaidStatus && record.afterSaleIssueStatus === "已解决") {
        record.afterSaleIssueStatus = "处理中";
      }
      if (record.afterSaleStatus === installedPaidStatus && !record.installedPaidAt) {
        record.installedPaidAt = record.afterSaleUpdatedAt || record.closedAt;
      }
      record.dealImageNames = normalizeFileNames(record.dealImageNames, record.dealImageName).slice(0, 6);
      record.dealImageName = record.dealImageNames[0] || "";
      record.orderAmount = String(record.orderAmount || "");
      record.depositAmount = String(record.depositAmount || "");
      record.salesShareRatio = normalizeSalesShareRatio(record.salesShareRatio);
      record.commissionPoints = normalizeCommissionPoints(record.commissionPoints);
      record.orderChangeStatus = normalizeOrderChangeStatus(record.orderChangeStatus);
      record.dealSource = normalizeDealSource(record.dealSource);
      record.dealArchiveDraft = normalizeDealArchiveDraft(record.dealArchiveDraft);
      if (!record.dealArchiveDraft) delete record.dealArchiveDraft;
      record.afterSaleDraft = normalizeAfterSaleDraft(record.afterSaleDraft);
      if (!record.afterSaleDraft) delete record.afterSaleDraft;
      if (record.id === "closed-sample-he-a" && !record.dealArchiveUpdatedAt) {
        if (!record.orderAmount) record.orderAmount = "56800";
        if (!record.depositAmount) record.depositAmount = "10000";
        if (!record.dealImageNames.length) record.dealImageNames = ["何女士-成交合同.jpg", "何女士-定金收款截图.jpg"];
        record.dealImageName = record.dealImageNames[0] || "";
        record.salesShareRatio = "50%";
        record.commissionPoints = "3点";
        record.orderChangeStatus = "没有改单";
      }
    });
    nextState.drafts.forEach((draft) => {
      if (!draft.id) {
        draft.id = `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      }
      if (!draft.employeeId && Array.isArray(nextState.employees) && nextState.employees.length) {
        draft.employeeId = nextState.employees[0].id;
      }
      if (!draft.contactType) {
        draft.contactType = "customer";
      }
      const isCustomerDraft = (draft.contactType || "customer") === "customer";
      if (isCustomerDraft && !draft.property) {
        draft.property = mockProperties[0].name;
      }
      if (isCustomerDraft && !draft.buildingNumber) {
        draft.buildingNumber = defaultBuildingNumbers[0];
      }
      if (isCustomerDraft && !draft.unit) {
        draft.unit = defaultUnits[0];
      }
      if (isCustomerDraft && !draft.room) {
        draft.room = buildRoomOptions()[0];
      }
      if (!draft.result || !renovationStages.includes(draft.result)) {
        draft.result = "暂不清楚";
      }
      if (isCustomerDraft && (!draft.customerType || !customerTypes.includes(draft.customerType))) {
        draft.customerType = "D类";
      }
      if (!isCustomerDraft) {
        if (draft.contactType === "channel") {
          draft.customerType = normalizeChannelIndustry(draft.customerType) || "其他行业";
        } else {
          const options = contactConfig(draft.contactType).options;
          if (!options.includes(draft.customerType)) {
            draft.customerType = options[0];
          }
        }
        draft.property = "";
        draft.buildingNumber = "";
        draft.unit = "";
        draft.building = "";
        draft.room = "";
        draft.floor = "";
      }
      if (!draft.status) {
        draft.status = "draft";
      }
      if (!draft.visitType) {
        draft.visitType = "新增拜访";
      }
      if (!contactLevels.includes(draft.contactLevel)) {
        draft.contactLevel = ["master", "channel"].includes(draft.contactType) ? contactLevels[3] : "";
      }
      draft.wechatStage = normalizeCustomerFollowStage(draft.wechatStage);
      if (draft.visitType === "门店接待") {
        draft.storeResult = normalizeStoreVisitResult(draft.storeResult || storeVisitResultFromStage(draft.wechatStage));
        draft.wechatStage = storeVisitResultStage(draft.storeResult);
        draft.result = "暂不清楚";
        draft.customerType = "A类";
      }
      if (isCustomerDraft && shouldForceCustomerTypeA(draft.wechatStage)) {
        draft.customerType = "A类";
      }
      draft.wechatFileNames = normalizeFileNames(draft.wechatFileNames, draft.wechatFileName);
      draft.wechatFileName = draft.wechatFileNames[0] || "";
      if (draft.wechatAdded !== "有" && draft.wechatAdded !== "没有") {
        draft.wechatAdded = draft.wechatFileNames.length || draft.wechatAvatarFileName || draft.wechatName ? "有" : "没有";
      }
      if (draft.reception === "没有开门") {
        draft.duration = 0;
      }
    });
    nextState.drafts = compactReturnDraftList(nextState.drafts).drafts;
    nextState.logs.forEach((log) => {
      if (!log.contactType) {
        log.contactType = "customer";
      }
      const isCustomerLog = isCustomerContactLog(log);
      if (!log.reception) {
        log.reception = isCustomerLog ? (log.result === "无人接待" ? "没有开门" : "有业主") : "";
      }
      if (log.reception === "无人接待" || log.reception === "没有师傅") {
        log.reception = "没有开门";
      }
      if (log.reception === "物业/前台接待") {
        log.reception = "有师傅";
      }
      const oldResultMap = {
        "有效客户": "水电",
        "待跟进": "拆改",
        "已加微信": "瓷砖",
        "拒绝": "已入住",
        "无有效客户": "暂不清楚",
        "无人接待": "暂不清楚"
      };
      if (!renovationStages.includes(log.result)) {
        log.result = oldResultMap[log.result] || "暂不清楚";
      }
      if (log.id === "log-1" && log.customer === "张经理") {
        log.result = "油漆";
        log.customerType = "A类";
        log.note = log.note || "墙面阶段，客户开始了解办公家具。";
      }
      if (isCustomerLog && !customerTypes.includes(log.customerType)) {
        if (["拆改", "水电"].includes(log.result)) {
          log.customerType = "A类";
        } else if (["瓷砖", "木工", "油漆"].includes(log.result)) {
          log.customerType = "B类";
        } else if (["吊顶", "定制安装", "软装进场"].includes(log.result)) {
          log.customerType = "C类";
        } else {
          log.customerType = "D类";
        }
      }
      if (!isCustomerLog) {
        if (log.contactType === "channel") {
          log.customerType = normalizeChannelIndustry(log.customerType) || "其他行业";
        } else {
          const options = contactConfig(log.contactType).options;
          if (!options.includes(log.customerType)) {
            log.customerType = options[0];
          }
        }
      }
      log.wechatStage = normalizeCustomerFollowStage(log.wechatStage);
      if (isCustomerLog && shouldForceCustomerTypeA(log.wechatStage)) {
        log.customerType = "A类";
      }
      if (isCustomerLog && !log.floor) {
        log.floor = extractFloor(log.location) || "1";
      }
      if (isCustomerLog && !log.property) {
        log.property = log.building || mockProperties[0].name;
      }
      if (isCustomerLog && !log.buildingNumber) {
        const property = mockProperties.find((item) => log.property.includes(item.name) || item.name.includes(log.property));
        log.buildingNumber = coerceBuildingNumber(log.buildingBlock || log.building, property?.buildings?.[0] || defaultBuildingNumbers[0]);
      }
      if (isCustomerLog && !log.unit) {
        const property = mockProperties.find((item) => log.property.includes(item.name) || item.name.includes(log.property));
        log.unit = coerceUnit(log.buildingBlock || log.building, property?.units?.[0] || defaultUnits[0]);
      }
      if (isCustomerLog && !log.room) {
        log.room = buildRoomOptions(log.floor)[0];
      }
      if (isCustomerLog) {
        log.building = displayBuilding(log);
      } else {
        log.property = "";
        log.buildingNumber = "";
        log.unit = "";
        log.building = "";
        log.room = "";
        log.floor = "";
        log.locationSource = log.locationSource || "师傅/异业资源，无需楼盘房号";
      }
      if (!log.durationSource) {
        log.durationSource = isCustomerLog ? "员工下拉选择" : "师傅/异业等级记录，无需填写现场停留";
      }
      if (!isCustomerLog || log.reception === "没有开门") {
        log.duration = 0;
      }
      if (log.wechatAdded !== "有" && log.wechatAdded !== "没有") {
        log.wechatAdded = displayWechatAdded(log);
      }
      if (!log.visitType) {
        log.visitType = "新增拜访";
      }
      if (log.visitType === "门店接待") {
        log.storeResult = normalizeStoreVisitResult(log.storeResult || storeVisitResultFromStage(log.wechatStage));
        log.wechatStage = storeVisitResultStage(log.storeResult);
        log.reception = "门店接待";
        log.result = "暂不清楚";
        log.duration = 0;
        log.customerType = "A类";
      }
      if (!contactLevels.includes(log.contactLevel)) {
        log.contactLevel = ["master", "channel"].includes(log.contactType) ? contactLevels[3] : "";
      }
      log.wechatFileNames = normalizeFileNames(log.wechatFileNames, log.wechatFileName || log.wechatProof?.fileName);
      log.wechatFileName = log.wechatFileNames[0] || "";
      if (log.wechatProof) {
        log.wechatProof.fileNames = normalizeFileNames(log.wechatProof.fileNames, log.wechatProof.fileName || log.wechatFileName);
        log.wechatProof.fileName = log.wechatProof.fileNames[0] || log.wechatProof.fileName || "";
      }
      log.status = "submitted";
      log.locked = true;
    });
    const hasWechatProof = nextState.logs.some((log) => log.wechatProof);
    if (!hasWechatProof && nextState.logs.length) {
      const newestLog = nextState.logs
        .slice()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      const employee = nextState.employees.find((item) => item.id === newestLog.employeeId);
      newestLog.wechatProof = buildSampleWechatProof(newestLog, employee);
      newestLog.wechatAdded = "有";
    }
    ensureSampleClosedCustomers(nextState);
    nextState.closedCustomers.forEach((record) => {
      record.afterSaleStatus = normalizeAfterSaleStatus(record.afterSaleStatus);
      record.afterSaleIssueStatus = normalizeAfterSaleIssueStatus(record.afterSaleIssueStatus);
      record.dealLifecycleStatus = normalizeDealLifecycleStatus(record.dealLifecycleStatus);
      if (!record.afterSaleUpdatedAt) record.afterSaleUpdatedAt = record.closedAt || new Date().toISOString();
      if (record.installedPaidAt) record.afterSaleStatus = installedPaidStatus;
      if (record.id === "closed-sample-liu" && record.afterSaleStatus === installedPaidStatus && record.afterSaleIssueStatus === "已解决") {
        record.afterSaleIssueStatus = "处理中";
      }
      if (record.afterSaleStatus === installedPaidStatus && !record.installedPaidAt) {
        record.installedPaidAt = record.afterSaleUpdatedAt || record.closedAt;
      }
      record.salesShareRatio = normalizeSalesShareRatio(record.salesShareRatio);
      record.commissionPoints = normalizeCommissionPoints(record.commissionPoints);
      record.orderChangeStatus = normalizeOrderChangeStatus(record.orderChangeStatus);
      record.dealSource = normalizeDealSource(record.dealSource);
      record.dealArchiveDraft = normalizeDealArchiveDraft(record.dealArchiveDraft);
      if (!record.dealArchiveDraft) delete record.dealArchiveDraft;
      record.afterSaleDraft = normalizeAfterSaleDraft(record.afterSaleDraft);
      if (!record.afterSaleDraft) delete record.afterSaleDraft;
      record.dealImageNames = normalizeFileNames(record.dealImageNames, record.dealImageName).slice(0, 6);
      record.dealImageName = record.dealImageNames[0] || "";
    });
    nextState.changeLogs.forEach((log) => {
      if (!log.id) log.id = `change-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      if (!log.timestamp) log.timestamp = new Date().toISOString();
      if (!log.employeeId) log.employeeId = demoLoggedInEmployeeId;
      if (!log.fieldLabel) log.fieldLabel = log.field || "资料";
    });
    return nextState;
  }

  let state = loadState();
  let activeDraftId = "";
  let activeCustomerKey = "";
  let activeClosedCustomerId = "";
  let activeAfterSaleCustomerId = "";
  let activeInstalledPaidCustomerId = "";
  let activeAfterSaleFilter = "";
  let activeInstalledPaidFilter = "";
  let closedCustomerTemplate = "search";
  let afterSaleTemplate = "search";
  let installedPaidTemplate = "search";
  let closedCustomerFilters = {
    property: "",
    building: ""
  };
  let afterSaleFilters = {
    property: "",
    building: ""
  };
  let installedPaidFilters = {
    property: "",
    building: ""
  };
  let ocrEnginePromise = null;
  let refreshTimer = null;
  let activeRole = "boss";
  let autosaveTimer = null;
  let suppressAutosave = false;
  let formHasUserChanges = false;
  let formTouchedAddress = false;
  let avatarRecognitionRunId = 0;
  let wechatHomepageFingerprintRunId = 0;
  let draftStatusHint = "";
  let draftStatusLevel = "";
  let draftTrayNotice = "";
  let formEditMode = false;
  const FORM_LOCK_MESSAGE = "先点“新登记”开始填写，或从下方草稿点“继续编辑”。";
  const RETURN_LOCK_MESSAGE = "先选择老客户，选中后带出资料再填写回访。";
  const STORE_LOCK_MESSAGE = "门店接待登记上门客户，先点“新登记”再填写。";
  const CLOSED_LOCK_MESSAGE = "已成交客户只用于查看和维护，不需要填写拜访日志。";
  const AFTER_SALE_LOCK_MESSAGE = "售后维护只更新送装、回访、转介绍状态，不需要填写拜访日志。";
  const INSTALLED_PAID_LOCK_MESSAGE = "已安装收尾款是最终存档，只能检索查看，不需要填写拜访日志。";
  const uploadPreviewConfig = {
    photoInput: {
      previewId: "photoPreview",
      addText: "添加照片",
      addMoreText: "继续添加",
      label: "现场",
      max: 6,
      multiple: true,
      rememberedLabel: "已记录"
    },
    wechatInput: {
      previewId: "wechatPreview",
      addText: "上传截图",
      addMoreText: "继续添加",
      label: "聊天",
      max: 6,
      multiple: true,
      rememberedLabel: "聊天截图"
    },
    wechatAvatarInput: {
      previewId: "wechatAvatarPreview",
      addText: "上传主页",
      addMoreText: "重新上传",
      label: "主页",
      max: 1,
      multiple: false,
      rememberedLabel: "主页截图"
    }
  };
  const uploadFilesCache = new Map();
  const rememberedUploadNames = {
    photoInput: [],
    wechatInput: [],
    wechatAvatarInput: []
  };
  const uploadPreviewUrls = new Map();
  const dealImagePreviews = new Map();

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function normalizeResourceCategoriesForCurrentState() {
    let changed = false;
    state.logs.forEach((log) => {
      if (log.contactType !== "channel") return;
      const normalized = normalizeChannelIndustry(log.customerType) || "其他行业";
      if (log.customerType !== normalized) {
        log.customerType = normalized;
        changed = true;
      }
    });
    state.drafts.forEach((draft) => {
      if (draft.contactType !== "channel") return;
      const normalized = normalizeChannelIndustry(draft.customerType) || "其他行业";
      if (draft.customerType !== normalized) {
        draft.customerType = normalized;
        changed = true;
      }
    });
    if (changed) saveState();
  }

  function getEmployee(id) {
    return state.employees.find((employee) => employee.id === id);
  }

  function getLog(id) {
    return state.logs.find((log) => log.id === id);
  }

  function getDraft(id) {
    return state.drafts.find((draft) => draft.id === id);
  }

  function currentEmployeeId() {
    return state.employees.some((employee) => employee.id === demoLoggedInEmployeeId)
      ? demoLoggedInEmployeeId
      : state.employees[0]?.id || "";
  }

  function currentEmployee() {
    return getEmployee(currentEmployeeId());
  }

  function isReturnVisitMode() {
    return $("#returnVisitMode")?.classList.contains("active") || false;
  }

  function isStoreVisitMode() {
    return $("#storeVisitMode")?.classList.contains("active") || false;
  }

  function isClosedVisitMode() {
    return $("#closedVisitMode")?.classList.contains("active") || false;
  }

  function isAfterSaleVisitMode() {
    return $("#afterSaleVisitMode")?.classList.contains("active") || false;
  }

  function isInstalledPaidVisitMode() {
    return $("#installedPaidVisitMode")?.classList.contains("active") || false;
  }

  function syncStoreVisitResultStage() {
    const select = $("#storeResultSelect");
    if (!select) return "已到过店";
    const result = normalizeStoreVisitResult(select.value);
    select.value = result;
    const stage = storeVisitResultStage(result);
    setSelectValue("#wechatStageInput", stage);
    return stage;
  }

  function currentStoreResult() {
    return normalizeStoreVisitResult($("#storeResultSelect")?.value);
  }

  function currentStoreContactStatus() {
    const result = currentStoreResult();
    if (result === "逛一圈就走") return "未留资料";
    if (result === "已成交") return "已留资料";
    return $("#storeContactSelect")?.value || "未留资料";
  }

  function storeResultNeedsContactChoice(result = currentStoreResult()) {
    return ["有意向", "做了预算，下次再来"].includes(normalizeStoreVisitResult(result));
  }

  function storeNeedsCustomerInfo() {
    const result = currentStoreResult();
    return result === "已成交" || currentStoreContactStatus() === "已留资料";
  }

  function storeNeedsPropertyInfo() {
    return currentStoreResult() === "已成交";
  }

  function storeAllowsAnonymous(payload = {}) {
    return payload.visitType === "门店接待" && payload.storeAnonymous;
  }

  function storeAnonymousLabel(result = currentStoreResult()) {
    if (result === "逛一圈就走") return "到店客流";
    if (result === "做了预算，下次再来") return "预算客户未留资料";
    return "意向客户未留资料";
  }

  function clearStoreHiddenContactFields() {
    if (!isStoreVisitMode() || storeNeedsCustomerInfo()) return;
    $("#customerInput").value = "";
    $("#phoneInput").value = "";
    $("#wechatAddedSelect").value = "没有";
    $("#wechatNameInput").value = "";
    delete $("#wechatNameInput").dataset.source;
    setWechatAvatarStatus("未上传");
    setRememberedUpload("wechatAvatarInput", []);
    clearWechatHomepageFingerprint();
  }

  function syncStoreReceptionLayout(options = {}) {
    const result = currentStoreResult();
    const needsChoice = storeResultNeedsContactChoice(result);
    const contactStatus = currentStoreContactStatus();
    $("#storeResultSelect").value = result;
    $("#storeContactSelect").value = contactStatus;
    $$("[data-store-result]").forEach((button) => {
      button.classList.toggle("active", button.dataset.storeResult === result);
    });
    $$("[data-store-contact]").forEach((button) => {
      button.classList.toggle("active", button.dataset.storeContact === contactStatus);
    });
    $("#storeContactChoice")?.classList.toggle("is-hidden", !needsChoice);
    const hintMap = {
      "逛一圈就走": "不留资料，提交后只统计到店客流",
      "有意向": contactStatus === "已留资料" ? "留了电话或微信，进入老客户回访区" : "未留资料，只记录意向客流",
      "做了预算，下次再来": contactStatus === "已留资料" ? "留了电话或微信，进入老客户回访区" : "未留资料，只记录预算客流",
      "已成交": "成交客户需填写资料，提交后进入已成交区"
    };
    $("#storeResultHint").textContent = hintMap[result] || "先选客户这次到店属于哪种情况";
    if (options.clearHidden !== false) clearStoreHiddenContactFields();
    syncStoreVisitResultStage();
    syncCustomerTypeLock();
  }

  function ensureSelectOption(selector, value, label = value) {
    const select = $(selector);
    if (!select || !value) return;
    const exists = Array.from(select.options).some((option) => option.value === value);
    if (!exists) {
      select.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`);
    }
  }

  function syncScrollPicker(selectId) {
    const select = $(`#${selectId}`);
    const trigger = $(`[data-scroll-picker="${selectId}"]`);
    const text = $(`#${selectId}PickerText`);
    const menu = $(`#${selectId}PickerMenu`);
    if (!select || !trigger || !text || !menu) return;
    const selectedOption = select.options[select.selectedIndex];
    text.textContent = selectedOption?.textContent || "请选择";
    trigger.disabled = select.disabled;
    trigger.classList.toggle("is-disabled", select.disabled);
    menu.innerHTML = Array.from(select.options).map((option) => `
      <button class="${option.value === select.value ? "active" : ""}" type="button" data-scroll-option="${escapeHtml(selectId)}" data-scroll-value="${escapeHtml(option.value)}">
        ${escapeHtml(option.textContent)}
      </button>
    `).join("");
  }

  function syncAllScrollPickers() {
    ["buildingSelect", "resultSelect"].forEach(syncScrollPicker);
  }

  function closeScrollPickers(exceptId = "") {
    ["buildingSelect", "resultSelect"].forEach((selectId) => {
      if (selectId === exceptId) return;
      $(`#${selectId}PickerMenu`)?.classList.add("is-hidden");
      $(`[data-scroll-picker="${selectId}"]`)?.setAttribute("aria-expanded", "false");
    });
  }

  function toggleScrollPicker(selectId) {
    const select = $(`#${selectId}`);
    const trigger = $(`[data-scroll-picker="${selectId}"]`);
    const menu = $(`#${selectId}PickerMenu`);
    if (!select || !trigger || !menu || trigger.disabled || select.disabled) return;
    const nextOpen = menu.classList.contains("is-hidden");
    closeScrollPickers(nextOpen ? selectId : "");
    menu.classList.toggle("is-hidden", !nextOpen);
    trigger.setAttribute("aria-expanded", String(nextOpen));
    if (nextOpen) syncScrollPicker(selectId);
  }

  function chooseScrollPickerOption(selectId, value) {
    const select = $(`#${selectId}`);
    if (!select) return;
    select.value = value;
    closeScrollPickers();
    syncScrollPicker(selectId);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function closedCustomerForKey(key) {
    return state.closedCustomers
      .filter((record) => record.customerKey === key && record.status === "closed")
      .sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt))[0];
  }

  function closedCustomerForIdentity(log) {
    if (!log || !isCustomerContactLog(log)) return null;
    return state.closedCustomers
      .filter((record) => record.status === "closed" && (record.employeeId || log.employeeId) === log.employeeId)
      .filter((record) => customerIdentityMatchReason(log, record))
      .sort((a, b) => new Date(b.closedAt || 0) - new Date(a.closedAt || 0))[0] || null;
  }

  function isClosedCustomerLog(log) {
    return Boolean(closedCustomerForKey(customerRecordKey(log)) || closedCustomerForIdentity(log));
  }

  function oldCustomerRecords(type = currentContactType()) {
    const seen = new Set();
    return state.logs
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .reduce((records, log) => {
        const primary = primaryRecordForLog(log);
        if (!primary?.customer || primary.employeeId !== currentEmployeeId()) return records;
        if (type === "customer" && isClosedCustomerLog(primary)) return records;
        const typeMatches = type === "customer"
          ? isCustomerContactLog(primary)
          : (primary.contactType || "customer") === type;
        if (!typeMatches) return records;

        const phoneKey = usablePhoneKey(primary.phone);
        const wechatKey = wechatHomepageKey(primary);
        const key = type === "customer"
          ? (customerAddressKey(primary) || `customer-unverified|${primary.id || phoneKey || wechatKey || log.id}`)
          : (phoneKey
              ? `${type}|phone:${phoneKey}`
              : (wechatKey ? `${type}|${wechatKey}` : `${type}|unverified|${primary.id || log.id}`));
        if (seen.has(key)) return records;
        seen.add(key);
        records.push(primary);
        return records;
      }, []);
  }

  function oldCustomerPickerConfig(type = currentContactType()) {
    const configs = {
      customer: {
        pickerLabel: "选择老客户",
        emptyText: "暂无已保存客户",
        triggerEmpty: "请选择老客户",
        statusReady: "选择后自动带出客户资料",
        statusLoadedPrefix: "已带出客户",
        levelOne: "小区",
        levelTwo: "楼栋",
        levelThree: "客户",
        groupFallback: "未选择小区",
        secondFallback: "未选择楼栋"
      },
      master: {
        pickerLabel: "选择师傅",
        emptyText: "暂无已保存师傅",
        triggerEmpty: "请选择师傅",
        statusReady: "选择后自动带出师傅资料",
        statusLoadedPrefix: "已带出师傅",
        levelOne: "工种",
        levelTwo: "等级",
        levelThree: "师傅",
        groupFallback: "未填写工种",
        secondFallback: contactLevels[3]
      },
      channel: {
        pickerLabel: "选择异业/渠道",
        emptyText: "暂无已保存异业",
        triggerEmpty: "请选择异业/渠道",
        statusReady: "选择后自动带出渠道资料",
        statusLoadedPrefix: "已带出渠道",
        levelOne: "所属行业",
        levelTwo: "等级",
        levelThree: "联系人",
        groupFallback: "未填写行业",
        secondFallback: contactLevels[3]
      }
    };
    return configs[type] || configs.customer;
  }

  function uniqueValues(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function customerSearchText(log) {
    return [
      log.customer,
      log.phone,
      log.wechatName,
      log.property,
      log.buildingNumber,
      displayRoom(log),
      log.result,
      log.customerType,
      log.note
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function customerResultMeta(log) {
    return [
      log.phone || log.wechatName || "未留联系方式",
      displayBuilding(log),
      displayRoom(log)
    ].filter(Boolean).join(" · ");
  }

  function renderCustomerResultCards(records, selectedCustomerId, emptyText = "没有匹配客户") {
    if (!records.length) {
      return `<div class="detail-empty">${escapeHtml(emptyText)}</div>`;
    }
    return records.map((log) => `
      <article class="customer-result-card ${log.id === selectedCustomerId ? "active" : ""}">
        <button class="customer-result-open" type="button" data-cascade-customer="${escapeHtml(log.id)}">
          <strong>${escapeHtml(log.customer)}</strong>
          <span>${escapeHtml(customerResultMeta(log))}</span>
          <small>${escapeHtml(log.result || "暂不清楚")} · ${escapeHtml(log.customerType || "未分类")}</small>
        </button>
      </article>
    `).join("");
  }

  function resourceSearchText(log) {
    return [
      log.customer,
      log.phone,
      log.wechatName,
      log.customerType,
      displayContactLevel(log),
      log.note
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function resourceResultMeta(log) {
    return [
      log.phone || "未留电话",
      log.wechatName || "未留微信",
      displayContactLevel(log)
    ].filter(Boolean).join(" · ");
  }

  function renderResourceFilterOptions(selector, values, emptyLabel, selectedValue) {
    const select = $(selector);
    if (!select) return;
    const optionValues = uniqueValues([
      ...(selectedValue && !values.includes(selectedValue) ? [selectedValue] : []),
      ...values
    ]);
    select.innerHTML = [
      `<option value="">${escapeHtml(emptyLabel)}</option>`,
      ...optionValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    ].join("");
    select.value = optionValues.includes(selectedValue) ? selectedValue : "";
  }

  function currentContactCategoryValue(type = currentContactType()) {
    const select = $("#customerTypeSelect");
    if (!select) return "";
    if (type === "channel" && select.value === channelIndustryCustomValue) {
      return $("#channelIndustryCustomInput")?.value.trim() || "";
    }
    return select.value || "";
  }

  function syncOldResourceFiltersFromForm(options = {}) {
    const type = currentContactType();
    if (!isReturnVisitMode() || !["master", "channel"].includes(type)) return;

    oldResourceFilters.type = currentContactCategoryValue(type);
    oldResourceFilters.level = contactLevels.includes($("#contactLevelSelect")?.value)
      ? $("#contactLevelSelect").value
      : "";
    if (!options.keepSelection) oldCustomerCascade.customerId = "";
    if (options.render) {
      renderOldResourceOptions(options.selectedId || "");
    }
  }

  function renderOldResourceOptions(selectedId = "") {
    const customerValue = $("#oldCustomerSelect");
    const trigger = $("#oldCustomerCascadeButton");
    const triggerText = $("#oldCustomerCascadeText");
    const pickerLabel = $("#oldCustomerPickerLabel");
    const customerPanel = $("#oldCustomerCustomerPanel");
    const resourcePanel = $("#oldCustomerResourcePanel");
    const searchInput = $("#oldResourceSearchInput");
    const resultSummary = $("#oldResourceResultSummary");
    const resultList = $("#oldResourceResultList");
    const type = currentContactType();
    const config = oldCustomerPickerConfig(type);
    const records = oldCustomerRecords(type);
    if (!customerValue || !trigger || !triggerText || !resourcePanel || !resultSummary || !resultList) return;

    if (pickerLabel) pickerLabel.textContent = config.pickerLabel;
    customerPanel?.classList.add("is-hidden");
    resourcePanel.classList.remove("is-hidden");
    $("#oldCustomerCascadeMenu")?.classList.add("resource-search-menu");
    $("#oldCustomerCascadeMenu")?.classList.remove("resource-cascade");

    const typeOptions = uniqueValues([
      ...records.map((log) => log.customerType || config.groupFallback),
      currentContactCategoryValue(type)
    ]);
    const levelOptions = contactLevels.filter((level) => records.some((log) => displayContactLevel(log) === level));
    if (oldResourceFilters.type && !typeOptions.includes(oldResourceFilters.type)) oldResourceFilters.type = "";
    if (oldResourceFilters.level && !levelOptions.includes(oldResourceFilters.level)) oldResourceFilters.level = "";
    renderResourceFilterOptions("#oldResourceTypeFilter", typeOptions, type === "master" ? "全部工种" : "全部行业", oldResourceFilters.type);
    renderResourceFilterOptions("#oldResourceLevelFilter", levelOptions, "全部等级", oldResourceFilters.level);
    if (searchInput) searchInput.value = oldResourceFilters.query;

    if (!records.length) {
      oldCustomerCascade = { property: "", building: "", customerId: "" };
      trigger.disabled = true;
      triggerText.textContent = config.emptyText;
      customerValue.value = "";
      resultSummary.textContent = config.emptyText;
      resultList.innerHTML = "";
      setOldCustomerStatus(config.emptyText, "warn");
      syncFormEditModeControls();
      return;
    }

    trigger.disabled = false;

    const query = oldResourceFilters.query.trim().toLowerCase();
    const filteredRecords = records.filter((log) => {
      const typeMatched = !oldResourceFilters.type || log.customerType === oldResourceFilters.type;
      const levelMatched = !oldResourceFilters.level || displayContactLevel(log) === oldResourceFilters.level;
      const queryMatched = !query || resourceSearchText(log).includes(query);
      return typeMatched && levelMatched && queryMatched;
    });

    if (!filteredRecords.length) {
      customerValue.value = "";
      triggerText.textContent = "没有匹配结果";
      resultSummary.textContent = "没有找到，换姓名、电话或清空筛选";
      resultList.innerHTML = "";
      setOldCustomerStatus("没有匹配结果", "warn");
      syncFormEditModeControls();
      return;
    }

    const selectedCustomerId = filteredRecords.some((log) => log.id === selectedId)
      ? selectedId
      : filteredRecords.some((log) => log.id === oldCustomerCascade.customerId)
        ? oldCustomerCascade.customerId
        : "";
    const selectedCustomer = filteredRecords.find((log) => log.id === selectedCustomerId);

    oldCustomerCascade = {
      property: oldResourceFilters.type,
      building: oldResourceFilters.level,
      customerId: selectedCustomerId
    };
    customerValue.value = selectedCustomerId;
    triggerText.textContent = selectedCustomer
      ? `${selectedCustomer.customer} · ${selectedCustomer.customerType || config.groupFallback} · ${displayContactLevel(selectedCustomer)}`
      : config.triggerEmpty;
    resultSummary.textContent = `找到 ${filteredRecords.length} 条，点名字带出资料`;
    resultList.innerHTML = filteredRecords.map((log) => `
      <button class="resource-result-card ${log.id === selectedCustomerId ? "active" : ""}" type="button" data-cascade-customer="${escapeHtml(log.id)}">
        <strong>${escapeHtml(log.customer)}</strong>
        <span>${escapeHtml(resourceResultMeta(log))}</span>
        <small>${escapeHtml(log.customerType || config.groupFallback)}</small>
      </button>
    `).join("");
    setOldCustomerStatus(selectedCustomer ? config.statusReady : "先搜索或点击名单选择", selectedCustomer ? "success" : "");
    syncFormEditModeControls();
  }

  let oldCustomerCascade = {
    property: "",
    building: "",
    customerId: ""
  };
  let oldCustomerTemplate = "search";
  let oldCustomerFilters = {
    query: "",
    property: "",
    building: ""
  };
  let oldResourceFilters = {
    query: "",
    type: "",
    level: ""
  };
  const collapsibleSectionState = {
    oldCustomerBody: false,
    propertyInfoBody: false,
    customerInfoBody: false,
    siteSituationBody: false,
    proofInfoBody: false
  };

  function renderOldCustomerOptions(selectedId = "") {
    const customerValue = $("#oldCustomerSelect");
    const trigger = $("#oldCustomerCascadeButton");
    const triggerText = $("#oldCustomerCascadeText");
    const pickerLabel = $("#oldCustomerPickerLabel");
    const customerPanel = $("#oldCustomerCustomerPanel");
    const resourcePanel = $("#oldCustomerResourcePanel");
    const templateWorkarea = $("#oldCustomerTemplateWorkarea");
    if (!customerValue || !trigger || !triggerText) return;
    const type = currentContactType();
    const isCustomer = type === "customer";
    if (!isCustomer) {
      renderOldResourceOptions(selectedId);
      return;
    }
    if (!templateWorkarea) return;
    const config = oldCustomerPickerConfig(type);
    const records = oldCustomerRecords(type);

    if (pickerLabel) pickerLabel.textContent = config.pickerLabel;
    customerPanel?.classList.remove("is-hidden");
    resourcePanel?.classList.add("is-hidden");
    $("#oldCustomerCascadeMenu")?.classList.remove("resource-search-menu", "resource-cascade");
    $$("[data-old-template]").forEach((button) => {
      button.classList.toggle("active", button.dataset.oldTemplate === oldCustomerTemplate);
    });

    if (!records.length) {
      oldCustomerCascade = { property: "", building: "", customerId: "" };
      trigger.disabled = true;
      triggerText.textContent = config.emptyText;
      customerValue.value = "";
      templateWorkarea.innerHTML = `<div class="detail-empty">${escapeHtml(config.emptyText)}</div>`;
      setOldCustomerStatus(config.emptyText, "warn");
      syncFormEditModeControls();
      return;
    }

    trigger.disabled = false;

    const selectedLog = selectedId ? records.find((log) => log.id === selectedId) : null;
    const properties = uniqueValues(records.map((log) => log.property || displayBuilding(log) || config.groupFallback));
    if (oldCustomerFilters.property && !properties.includes(oldCustomerFilters.property)) oldCustomerFilters.property = "";
    const propertyValue = selectedLog?.property || oldCustomerFilters.property || properties[0] || "";
    const propertyRecords = propertyValue
      ? records.filter((log) => (log.property || displayBuilding(log) || config.groupFallback) === propertyValue)
      : records;
    const buildings = uniqueValues(propertyRecords.map((log) => log.buildingNumber || coerceBuildingNumber(log.building, config.secondFallback)));
    if (oldCustomerFilters.building && !buildings.includes(oldCustomerFilters.building)) oldCustomerFilters.building = "";
    const buildingValue = selectedLog?.buildingNumber || oldCustomerFilters.building || buildings[0] || "";
    const query = oldCustomerFilters.query.trim().toLowerCase();

    const selectedRecordId = selectedId || oldCustomerCascade.customerId || customerValue.value;
    let templateRecords = records;
    if (oldCustomerTemplate === "search") {
      templateRecords = records.filter((log) => !query || customerSearchText(log).includes(query));
      templateWorkarea.innerHTML = `
        <div class="customer-template-panel">
          <input id="oldCustomerSearchInput" type="search" autocomplete="off" placeholder="搜索客户 / 电话 / 小区 / 房号" value="${escapeHtml(oldCustomerFilters.query)}" />
          <div class="resource-result-summary" id="oldCustomerTemplateSummary">找到 ${templateRecords.length} 条</div>
          <div class="customer-result-list" id="oldCustomerResultList">${renderCustomerResultCards(templateRecords, selectedRecordId, "没有找到，换姓名、电话、小区或房号")}</div>
        </div>
      `;
    } else if (oldCustomerTemplate === "area") {
      templateRecords = propertyRecords.filter((log) => (log.buildingNumber || coerceBuildingNumber(log.building, config.secondFallback)) === buildingValue);
      oldCustomerFilters.property = propertyValue;
      oldCustomerFilters.building = buildingValue;
      templateWorkarea.innerHTML = `
        <div class="customer-template-panel">
          <div class="resource-filter-row">
            <select id="oldCustomerPropertyFilter">
              ${properties.map((property) => `<option value="${escapeHtml(property)}" ${property === propertyValue ? "selected" : ""}>${escapeHtml(property)}</option>`).join("")}
            </select>
            <select id="oldCustomerBuildingFilter">
              ${buildings.map((building) => `<option value="${escapeHtml(building)}" ${building === buildingValue ? "selected" : ""}>${escapeHtml(building)}</option>`).join("")}
            </select>
          </div>
          <div class="resource-result-summary" id="oldCustomerTemplateSummary">${propertyValue} ${buildingValue}，共 ${templateRecords.length} 条</div>
          <div class="customer-result-list" id="oldCustomerResultList">${renderCustomerResultCards(templateRecords, selectedRecordId, "这个小区楼栋暂无客户")}</div>
        </div>
      `;
    } else {
      templateRecords = records.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);
      templateWorkarea.innerHTML = `
        <div class="customer-template-panel">
          <div class="resource-result-summary" id="oldCustomerTemplateSummary">最近 ${templateRecords.length} 条</div>
          <div class="customer-result-list recent-result-list" id="oldCustomerResultList">${renderCustomerResultCards(templateRecords, selectedRecordId, "暂无最近客户")}</div>
        </div>
      `;
    }

    const selectedCustomerId = templateRecords.some((log) => log.id === selectedId)
      ? selectedId
      : templateRecords.some((log) => log.id === oldCustomerCascade.customerId)
        ? oldCustomerCascade.customerId
        : "";
    const selectedCustomer = templateRecords.find((log) => log.id === selectedCustomerId);
    oldCustomerCascade = {
      property: propertyValue,
      building: buildingValue,
      customerId: selectedCustomerId
    };
    customerValue.value = selectedCustomerId;
    triggerText.textContent = selectedCustomer
      ? `${selectedCustomer.customer} · ${displayBuilding(selectedCustomer)} ${displayRoom(selectedCustomer)}`
      : templateRecords.length
        ? config.triggerEmpty
        : "没有匹配结果";
    setOldCustomerStatus(
      selectedCustomer ? config.statusReady : templateRecords.length ? "选择一个客户后自动带出资料" : "没有匹配客户",
      selectedCustomer ? "success" : templateRecords.length ? "" : "warn"
    );
    syncFormEditModeControls();
  }

  function refreshOldCustomerSearchResults() {
    if (currentContactType() !== "customer" || oldCustomerTemplate !== "search") return;
    const records = oldCustomerRecords("customer");
    const query = oldCustomerFilters.query.trim().toLowerCase();
    const filteredRecords = records.filter((log) => !query || customerSearchText(log).includes(query));
    const selectedCustomerId = filteredRecords.some((log) => log.id === oldCustomerCascade.customerId)
      ? oldCustomerCascade.customerId
      : "";
    const selectedCustomer = filteredRecords.find((log) => log.id === selectedCustomerId);
    const summary = $("#oldCustomerTemplateSummary");
    const resultList = $("#oldCustomerResultList");
    if (summary) summary.textContent = `找到 ${filteredRecords.length} 条`;
    if (resultList) {
      resultList.innerHTML = renderCustomerResultCards(filteredRecords, selectedCustomerId, "没有找到，换姓名、电话、小区或房号");
    }
    oldCustomerCascade.customerId = selectedCustomerId;
    $("#oldCustomerSelect").value = selectedCustomerId;
    $("#oldCustomerCascadeText").textContent = selectedCustomer
      ? `${selectedCustomer.customer} · ${displayBuilding(selectedCustomer)} ${displayRoom(selectedCustomer)}`
      : filteredRecords.length
        ? oldCustomerPickerConfig("customer").triggerEmpty
        : "没有匹配结果";
    setOldCustomerStatus(
      selectedCustomerId ? oldCustomerPickerConfig("customer").statusReady : filteredRecords.length ? "选择一个客户后自动带出资料" : "没有匹配客户",
      selectedCustomerId ? "success" : filteredRecords.length ? "" : "warn"
    );
    syncFormEditModeControls();
  }

  function setOldCustomerStatus(message, level = "") {
    const status = $("#oldCustomerStatus");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("success", level === "success");
    status.classList.toggle("warn", level === "warn");
  }

  function preserveActiveFormBeforeClosedMode() {
    if (!formEditMode || suppressAutosave) return false;
    if (!hasMeaningfulFormInput() && !activeDraft()) return false;
    const savedDraft = saveCurrentDraft({ silent: true, force: true });
    if (!savedDraft) return false;
    activeDraftId = "";
    draftTrayNotice = "刚才正在填写的内容已存为草稿，回到对应入口可继续编辑。";
    return true;
  }

  function setVisitMode(mode, options = {}) {
    const previousMode = currentVisitMode();
    const nextMode = mode === "return" ? "return" : mode === "store" ? "store" : mode === "closed" ? "closed" : mode === "afterSale" ? "afterSale" : mode === "installedPaid" ? "installedPaid" : "new";
    const isNew = nextMode === "new";
    const isReturn = nextMode === "return";
    const isStore = nextMode === "store";
    const isClosed = nextMode === "closed";
    const isAfterSale = nextMode === "afterSale";
    const isInstalledPaid = nextMode === "installedPaid";
    const isLifecycleView = isClosed || isAfterSale || isInstalledPaid;
    const shouldLockAfterEntryModeChange = previousMode !== nextMode
      && ["new", "return", "store"].includes(nextMode)
      && options.keepEditing !== true;
    const preservedDraft = isLifecycleView ? preserveActiveFormBeforeClosedMode() : false;

    $("#newVisitMode")?.classList.toggle("active", isNew);
    $("#returnVisitMode")?.classList.toggle("active", isReturn);
    $("#storeVisitMode")?.classList.toggle("active", isStore);
    $("#closedVisitMode")?.classList.toggle("active", isClosed);
    $("#afterSaleVisitMode")?.classList.toggle("active", isAfterSale);
    $("#installedPaidVisitMode")?.classList.toggle("active", isInstalledPaid);
    $("#oldCustomerSection")?.classList.toggle("is-hidden", !isReturn);
    $("#closedCustomerSection")?.classList.toggle("is-hidden", !isClosed);
    $("#afterSaleSection")?.classList.toggle("is-hidden", !isAfterSale);
    $("#installedPaidSection")?.classList.toggle("is-hidden", !isInstalledPaid);
    if (isStore && currentContactType() !== "customer") {
      setContactType("customer", "A类", "", { refreshReturnPicker: false });
    }
    if (isStore) {
      syncStoreVisitResultStage();
      syncCustomerTypeLock();
    }
    syncFormLayoutByMode();

    if (isReturn) {
      renderOldCustomerOptions(options.selectedId || "");
      if (options.applyFirst !== false && $("#oldCustomerSelect").value) {
        applyOldCustomer($("#oldCustomerSelect").value);
      }
    }
    if (isLifecycleView) {
      clearTimeout(autosaveTimer);
      formHasUserChanges = false;
      formEditMode = false;
      clearDraftStatusHint();
      if (isClosed) renderClosedCustomers();
      if (isAfterSale) renderAfterSaleCustomers();
      if (isInstalledPaid) renderInstalledPaidCustomers();
      syncFormEditModeControls();
      renderEmployeeDraftTray();
      renderDraftStatus();
      if (preservedDraft) showToast("当前填写内容已自动存为草稿");
      return;
    }
    if (shouldLockAfterEntryModeChange) {
      clearTimeout(autosaveTimer);
      formHasUserChanges = false;
      formEditMode = false;
      clearDraftStatusHint();
    }
    if (!formEditMode) {
      clearDraftStatusHint();
      syncFormEditModeControls();
    }
    renderEmployeeDraftTray();
    renderDraftStatus();
  }

  function applyOldCustomer(logId) {
    const log = getLog(logId);
    if (!log) return;

    const type = log.contactType || "customer";
    const isCustomer = type === "customer";
    setContactType(type, log.customerType || (isCustomer ? "D类" : ""), log.contactLevel || "", { refreshReturnPicker: false });
    if (isCustomer) {
      setPropertyValue(log.property || log.building || displayBuilding(log));
      renderBuildingNumberOptions();
      ensureSelectOption("#buildingNumberSelect", log.buildingNumber || coerceBuildingNumber(log.building));
      setSelectValue("#buildingNumberSelect", log.buildingNumber || coerceBuildingNumber(log.building));
      renderUnitOptions();
      ensureSelectOption("#unitSelect", log.unit || coerceUnit(log.building));
      setSelectValue("#unitSelect", log.unit || coerceUnit(log.building));
      renderRoomOptions();
      ensureSelectOption("#roomSelect", log.room || displayRoom(log));
      setSelectValue("#roomSelect", log.room || displayRoom(log));
    }

    $("#customerInput").value = log.customer || "";
    $("#phoneInput").value = log.phone || "";
    setContactCategoryValue(type, log.customerType || (isCustomer ? "D类" : ""));
    setSelectValue("#contactLevelSelect", log.contactLevel || contactLevels[3]);
    setSelectValue("#wechatAddedSelect", displayWechatAdded(log));
    $("#wechatNameInput").value = log.wechatName || log.wechatProof?.customerWechat || "";
    $("#wechatNameInput").dataset.source = log.wechatNameSource || "老客户资料";
    setRenovationResultValue(log.result || "暂不清楚");
    setSelectValue("#wechatStageInput", normalizeCustomerFollowStage(log.wechatStage));
    setWechatAvatarStatus(
      log.wechatAvatarFileName ? "已记录主页截图" : "可上传主页截图",
      log.wechatAvatarFileName ? "success" : "",
      log.wechatAvatarFileName ? "老客户资料已带出，可重新上传更新昵称" : "如本次有新的微信主页截图，可上传识别"
    );
    setRememberedUpload("wechatAvatarInput", log.wechatAvatarFileName ? [log.wechatAvatarFileName] : []);
    const homepageInput = $("#wechatAvatarInput");
    if (homepageInput) {
      if (log.wechatHomepageFingerprint || log.wechatProof?.homepageFingerprint) {
        homepageInput.dataset.homepageFingerprint = log.wechatHomepageFingerprint || log.wechatProof.homepageFingerprint;
      } else {
        delete homepageInput.dataset.homepageFingerprint;
      }
      delete homepageInput.dataset.homepageFingerprintPending;
    }
    setRememberedUpload("wechatInput", normalizeFileNames(log.wechatFileNames, log.wechatFileName || log.wechatProof?.fileName));
    syncWechatAddedByProof(log);
    syncWechatNameRequirement(log);
    syncCustomerTypeLock();
    syncOldResourceFiltersFromForm({ keepSelection: true });
    setOldCustomerStatus(`${oldCustomerPickerConfig(type).statusLoadedPrefix}：${log.customer || contactTypeLabel(type)}`, "success");
    refreshIdentityCheckFromForm();
  }

  function beginOldCustomerReturn(logId, options = {}) {
    const log = getLog(logId);
    if (!log) return false;
    const existingDraft = findMatchingReturnDraft({
      visitType: "老客户回访",
      oldCustomerLogId: logId,
      contactType: log.contactType || "customer",
      employeeId: currentEmployeeId()
    });
    if (existingDraft) {
      loadDraftToForm(existingDraft.id);
      setOldCustomerStatus(`已打开未提交草稿：${existingDraft.customer || log.customer || contactTypeLabel(log.contactType)}`, "success");
      if (options.toast !== false) showToast("这位老客户已有草稿，已继续编辑原草稿");
      return true;
    }

    applyOldCustomer(logId);
    setFormEditMode(true, "已带出老客户资料，可以填写本次回访。");
    scheduleAutosave();
    if (options.toast !== false) showToast("已带出老客户资料，可填写本次回访");
    return false;
  }

  function draftsForEmployee(employeeId) {
    return state.drafts
      .filter((draft) => draft.employeeId === employeeId)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }

  function draftVisitMode(draft) {
    return rawDraftVisitMode(draft);
  }

  function currentVisitMode() {
    if (isInstalledPaidVisitMode()) return "installedPaid";
    if (isAfterSaleVisitMode()) return "afterSale";
    if (isClosedVisitMode()) return "closed";
    if (isStoreVisitMode()) return "store";
    return isReturnVisitMode() ? "return" : "new";
  }

  function currentVisitModeLabel() {
    if (isInstalledPaidVisitMode()) return "已安装收尾款";
    if (isAfterSaleVisitMode()) return "售后维护";
    if (isClosedVisitMode()) return "已成交";
    if (isStoreVisitMode()) return "门店接待";
    return isReturnVisitMode() ? "老客户回访" : "新增拜访";
  }

  function currentDraftScopeLabel() {
    const modeLabel = currentVisitModeLabel();
    if (currentVisitMode() === "return") {
      return `${modeLabel} · ${contactTypeLabel(currentContactType())}`;
    }
    return modeLabel;
  }

  function editableVisitMode(mode = currentVisitMode()) {
    return ["new", "return", "store"].includes(mode) ? mode : "new";
  }

  function resettableVisitMode(mode = currentVisitMode()) {
    return ["new", "return", "store", "closed", "afterSale", "installedPaid"].includes(mode) ? mode : "new";
  }

  function postSubmitInstruction(mode) {
    if (mode === "return") return "继续回访请先选择下一位老客户。";
    if (mode === "store") return "继续登记门店客户请点“新登记”。";
    return "继续录入请点“新登记”。";
  }

  function postSubmitTargetMode(submittedMode, payload) {
    if (["store", "return"].includes(submittedMode) && payload?.wechatStage === "已成交") return "closed";
    if (submittedMode === "store" && payload?.storeAnonymous) return "store";
    if (submittedMode === "store") return "return";
    if (submittedMode === "new") return "new";
    return submittedMode;
  }

  function postSubmitTargetMessage(targetMode, submittedMode) {
    if (targetMode === "closed") return "已转到已成交区，可查看成交客户。";
    if (targetMode === "return" && submittedMode === "return") return "继续回访请先选择下一位老客户。";
    if (targetMode === "return") return "已转到老客户回访，后续跟进在这里选择客户。";
    if (targetMode === "new" && submittedMode === "new") return "继续录入请点“新登记”。";
    return postSubmitInstruction(targetMode);
  }

  function entryModeStartHint(mode) {
    if (mode === "return") return "请先选择老客户，再填写回访。";
    if (mode === "store") return "需要登记门店客户时，请点“新登记”。";
    return "需要登记新客户时，请点“新登记”。";
  }

  function visitModeLabel(mode) {
    if (mode === "return") return "老客户回访";
    if (mode === "store") return "门店接待";
    if (mode === "closed") return "已成交";
    if (mode === "afterSale") return "售后维护";
    if (mode === "installedPaid") return "已安装收尾款";
    return "新增拜访";
  }

  function switchVisitModeFromUser(mode) {
    const nextMode = resettableVisitMode(mode);
    const previousMode = currentVisitMode();
    const scrollPosition = currentWindowScrollPosition();
    if (nextMode === previousMode) {
      setVisitMode(nextMode);
      restoreWindowScroll(scrollPosition);
      return;
    }

    if (!["new", "return", "store"].includes(nextMode)) {
      setVisitMode(nextMode);
      restoreWindowScroll(scrollPosition);
      return;
    }

    const previousLabel = currentVisitModeLabel();
    const shouldSaveCurrent = formEditMode && (Boolean(activeDraft()) || hasMeaningfulFormInput());
    if (shouldSaveCurrent) {
      saveCurrentDraft({ silent: true, force: true });
    }

    draftTrayNotice = shouldSaveCurrent
      ? `刚才的${previousLabel}内容已自动保存为草稿。`
      : "";
    resetFormForBlankEntry(
      `${shouldSaveCurrent ? `已保存${previousLabel}草稿。` : `已切换到${visitModeLabel(nextMode)}。`}${entryModeStartHint(nextMode)}`,
      {
        editing: false,
        level: shouldSaveCurrent ? "success" : "warn",
        mode: nextMode,
        preserveScroll: true,
        scrollPosition
      }
    );
    if (shouldSaveCurrent) showToast(`已保存${previousLabel}草稿`);
  }

  function findMatchingReturnDraft(payload, excludedId = "") {
    const key = returnDraftKey(payload);
    if (!key) return null;
    return state.drafts
      .filter((draft) => draft.id !== excludedId && returnDraftKey(draft) === key)
      .sort((a, b) => draftTimeValue(b) - draftTimeValue(a))[0] || null;
  }

  function compactReturnDraftsForState(preferredId = "") {
    const result = compactReturnDraftList(state.drafts, preferredId);
    if (!result.changed) return false;
    state.drafts = result.drafts;
    if (activeDraftId && result.replacementIds.has(activeDraftId)) {
      activeDraftId = result.replacementIds.get(activeDraftId);
    }
    return true;
  }

  function draftsForCurrentVisitMode(employeeId = currentEmployeeId()) {
    const mode = currentVisitMode();
    const contactType = currentContactType();
    return draftsForEmployee(employeeId).filter((draft) => {
      if (draftVisitMode(draft) !== mode) return false;
      if (mode === "new") return true;
      if (mode === "store") {
        return (draft.contactType || "customer") === "customer";
      }
      if (mode === "return") {
        return (draft.contactType || "customer") === contactType;
      }
      return true;
    });
  }

  function selectedRegion() {
    const value = $("#regionFilter").value;
    const map = { east: "东区", south: "南区", west: "西区" };
    return map[value] || "all";
  }

  function employeesForSelectedRegion() {
    const region = selectedRegion();
    return region === "all"
      ? state.employees
      : state.employees.filter((employee) => employee.region === region);
  }

  function logsForSelectedDate() {
    const dateValue = $("#workDate").value;
    const employeeIds = new Set(employeesForSelectedRegion().map((employee) => employee.id));
    return state.logs.filter((log) => sameDay(log.timestamp, dateValue) && employeeIds.has(log.employeeId));
  }

  function logsForEmployeeDate(employeeId) {
    const dateValue = $("#workDate").value;
    return state.logs.filter((log) => sameDay(log.timestamp, dateValue) && log.employeeId === employeeId);
  }

  function employeeStats(employeeId) {
    const logs = logsForEmployeeDate(employeeId);
    const leads = logs.filter((log) => isCustomerContactLog(log) && ["A类", "B类"].includes(log.customerType)).length;
    const photos = logs.reduce((sum, log) => sum + Number(log.photos || 0), 0);
    return { visits: logs.length, leads, photos };
  }

  function employeeLogs(employeeId) {
    return logsForEmployeeDate(employeeId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  function leadLogs(employeeId) {
    return employeeLogs(employeeId).filter((log) => isCustomerContactLog(log) && ["A类", "B类"].includes(log.customerType));
  }

  function computeWarnings() {
    const warnings = [];
    const logs = logsForSelectedDate();

    state.invalidRequests
      .filter((request) => request.status === "pending")
      .forEach((request) => {
        const employee = getEmployee(request.employeeId);
        warnings.push({
          type: "无效客户待审",
          employee: employee?.name || "员工",
          text: `${employee?.name || "员工"}申请将${request.customer}标记为无效客户，原因：${request.reason}`,
          level: "warn",
          invalidRequestId: request.id
        });
      });

    state.orderChangeRequests
      .filter((request) => request.status === "pending")
      .forEach((request) => {
        const employee = getEmployee(request.employeeId);
        warnings.push({
          type: "改单待审",
          employee: employee?.name || "员工",
          text: `${employee?.name || "员工"}申请将${request.customer || "客户"}的改单状态从“${request.currentStatus}”改为“${request.requestedStatus}”`,
          level: "warn",
          orderChangeRequestId: request.id
        });
      });

    logs.forEach((log) => {
      const employee = getEmployee(log.employeeId);
      if (state.rules.photoRequired && Number(log.photos || 0) < state.rules.minPhotos) {
        warnings.push({
          type: "照片不足",
          employee: employee.name,
          text: `${employee.name}在${displayBuilding(log)}只提交了 ${log.photos || 0} 张现场照片`,
          level: "danger"
        });
      }
      if (isCustomerContactLog(log) && Number(log.duration || 0) < 6 && log.reception !== "没有开门") {
        warnings.push({
          type: "停留过短",
          employee: employee.name,
          text: `${employee.name}本次拜访只停留 ${log.duration} 分钟，建议确认是否真实到访`,
          level: "warn"
        });
      }
    });

    employeesForSelectedRegion().forEach((employee) => {
      const latest = logs
        .filter((log) => log.employeeId === employee.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      if (!latest) {
        warnings.push({
          type: "今日未提交",
          employee: employee.name,
          text: `${employee.name}今日尚未提交外勤日志`,
          level: "warn"
        });
        return;
      }
      const gap = Math.round((Date.now() - new Date(latest.timestamp).getTime()) / 60000);
      if (gap > state.rules.gapMinutes) {
        warnings.push({
          type: "长时间无更新",
          employee: employee.name,
          text: `${employee.name}距离上一条日志已 ${gap} 分钟，建议电话确认进度`,
          level: "warn"
        });
      }
    });

    return warnings;
  }

  function renderMetrics() {
    const logs = logsForSelectedDate();
    const totalTarget = employeesForSelectedRegion().reduce((sum, employee) => sum + Number(employee.target), 0);
    const activeCount = new Set(logs.map((log) => log.employeeId)).size;
    const customerLogs = logs.filter(isCustomerContactLog);
    const leads = customerLogs.filter((log) => ["A类", "B类"].includes(log.customerType)).length;
    const warnings = computeWarnings();
    const completion = totalTarget ? Math.round((logs.length / totalTarget) * 100) : 0;
    const conversion = customerLogs.length ? Math.round((leads / customerLogs.length) * 100) : 0;

    const metrics = [
      { label: "今日已提交日志", value: logs.length, hint: `拜访目标完成 ${completion}%` },
      { label: "今日有记录员工", value: activeCount, hint: `当前区域共 ${employeesForSelectedRegion().length} 人` },
      { label: "重点客户数", value: leads, hint: `A/B类占比 ${conversion}%` },
      { label: "待复核提醒", value: warnings.length, hint: warnings.length ? "有记录需要老板确认" : "当前无需复核" }
    ];

    $("#metricGrid").innerHTML = metrics.map((item) => `
      <article class="metric">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
        <small>${item.hint}</small>
      </article>
    `).join("");
  }

  function renderMap() {
    const warnings = computeWarnings();
    const riskNames = new Set(warnings.map((warning) => warning.employee));
    const zones = [
      { text: "高端住宅", x: 7, y: 18 },
      { text: "写字楼群", x: 48, y: 42 },
      { text: "交付小区", x: 64, y: 68 }
    ];

    $("#routeMap").innerHTML = `
      <span class="route-line"></span>
      ${zones.map((zone) => `
        <span class="map-zone" style="left:${zone.x}%;top:${zone.y}%">${zone.text}</span>
      `).join("")}
      ${employeesForSelectedRegion().map((employee) => `
        <button class="map-pin" type="button"
          data-risk="${riskNames.has(employee.name)}"
          data-status="${employee.status === "paused" ? "paused" : "working"}"
          style="--x:${employee.map.x}%;--y:${employee.map.y}%"
          title="${employee.name}：${employee.map.label}">
          ${initials(employee.name)}
        </button>
      `).join("")}
    `;
  }

  function renderWarnings() {
    const warnings = computeWarnings().slice(0, 5);
    $("#riskCount").textContent = `${computeWarnings().length} 条`;
    $("#warningList").innerHTML = warnings.length
      ? warnings.map((warning) => `
        <article class="warning-item">
          <strong>${warning.type}</strong>
          <div class="muted">${warning.text}</div>
          ${warning.invalidRequestId ? `
            <div class="warning-actions">
              <button class="tag" type="button" data-review-invalid="${escapeHtml(warning.invalidRequestId)}" data-invalid-action="approved">通过无效</button>
              <button class="tag" type="button" data-review-invalid="${escapeHtml(warning.invalidRequestId)}" data-invalid-action="rejected">驳回</button>
            </div>
          ` : ""}
          ${warning.orderChangeRequestId ? `
            <div class="warning-actions">
              <button class="tag" type="button" data-review-order-change="${escapeHtml(warning.orderChangeRequestId)}" data-order-change-action="approved">通过改单</button>
              <button class="tag" type="button" data-review-order-change="${escapeHtml(warning.orderChangeRequestId)}" data-order-change-action="rejected">驳回</button>
            </div>
          ` : ""}
        </article>
      `).join("")
      : `<article class="warning-item"><strong>暂无待复核记录</strong><div class="muted">今日日志满足当前审核规则。</div></article>`;
  }

  function renderHourChart() {
    const logs = logsForSelectedDate();
    const buckets = [
      { label: "08-10", from: 8, to: 10 },
      { label: "10-12", from: 10, to: 12 },
      { label: "12-14", from: 12, to: 14 },
      { label: "14-16", from: 14, to: 16 },
      { label: "16-18", from: 16, to: 18 },
      { label: "18-20", from: 18, to: 20 }
    ].map((bucket) => {
      const count = logs.filter((log) => {
        const hour = new Date(log.timestamp).getHours();
        return hour >= bucket.from && hour < bucket.to;
      }).length;
      return { ...bucket, count };
    });
    const max = Math.max(...buckets.map((bucket) => bucket.count), 1);

    $("#hourChart").innerHTML = buckets.map((bucket) => `
      <div class="bar-row">
        <span>${bucket.label}</span>
        <div class="bar-track"><span class="bar-fill" style="--value:${Math.max((bucket.count / max) * 100, 5)}%"></span></div>
        <b>${bucket.count}</b>
      </div>
    `).join("");
  }

  function renderLiveFeed() {
    const logs = logsForSelectedDate()
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 7);

    $("#liveFeed").innerHTML = logs.map((log) => {
      const employee = getEmployee(log.employeeId);
      const contactLevel = displayContactLevel(log);
      const badgeClass = contactLevel ? contactLevelBadgeClass(contactLevel) : receptionBadgeClass(displayReceptionResult(log));
      const siteLabel = contactLevel || displayReceptionResult(log) || "未填写现场情况";
      const siteDetail = contactLevel ? "contactLevel" : "reception";
      const siteTitle = contactLevel ? "查看师傅/异业等级" : "查看现场情况";
      const wechatLabel = log.wechatProof ? "微信截图" : "未传微信";
      const wechatClass = log.wechatProof ? "has-proof" : "missing-proof";
      return `
        <article class="timeline-item">
          <span class="timeline-time">${formatTime(log.timestamp)}</span>
          <div>
            <strong>${escapeHtml(employee.name)} · ${escapeHtml(displayBuilding(log))} · ${escapeHtml(displayRoom(log))}</strong>
            <div class="muted">${escapeHtml(log.customer)}，${escapeHtml(log.note || "无纪要")}</div>
            <div class="timeline-meta">
              <button class="badge ${badgeClass}" type="button" data-log-detail="${siteDetail}" data-log-id="${escapeHtml(log.id)}" title="${siteTitle}">${escapeHtml(siteLabel)}</button>
              <span class="tag">${escapeHtml(log.visitType || "新增拜访")}</span>
              <button class="tag" type="button" data-log-detail="customerType" data-log-id="${escapeHtml(log.id)}" title="查看客户类型说明">${escapeHtml(displayCustomerType(log))}</button>
              <span class="tag">微信：${escapeHtml(displayWechatAdded(log))}</span>
              <button class="tag" type="button" data-log-detail="photos" data-log-id="${escapeHtml(log.id)}" title="查看照片凭证">${Number(log.photos || 0)} 张照片</button>
              <button class="tag wechat-proof-button ${wechatClass}" type="button" data-wechat-log="${escapeHtml(log.id)}" title="查看员工上传的微信聊天截图">${wechatLabel}</button>
            </div>
          </div>
          <button class="duration-link" type="button" data-log-detail="duration" data-log-id="${escapeHtml(log.id)}" title="查看停留时间记录方式">${Number(log.duration || 0)} 分钟</button>
        </article>
      `;
    }).join("");
  }

  function renderEmployees() {
    const selectedEmployeeId = currentEmployeeId();
    const employees = activeRole === "employee"
      ? state.employees.filter((employee) => employee.id === selectedEmployeeId)
      : employeesForSelectedRegion();

    const board = $("#employeeBoard");
    if (!board) {
      renderEmployeeDraftTray();
      return;
    }

    board.innerHTML = employees.map((employee) => {
      const stats = employeeStats(employee.id);
      const drafts = activeRole === "employee" ? draftsForCurrentVisitMode(employee.id) : draftsForEmployee(employee.id);
      const latestDraft = drafts[0];
      const percent = Math.min(Math.round((stats.visits / employee.target) * 100), 100);
      const statusBadge = employee.status === "paused"
        ? `<span class="badge warn">长时间未更新</span>`
        : `<span class="badge good">外勤中</span>`;
      const draftTag = latestDraft
        ? `<button class="tag draft-tag open-draft" type="button" data-draft="${escapeHtml(latestDraft.id)}" title="继续修改未提交草稿">${activeRole === "employee" ? escapeHtml(currentVisitModeLabel()) : "草稿"} ${drafts.length} 条 · ${escapeHtml(latestDraft.customer || displayRoom(latestDraft))}</button>`
        : "";
      return `
        <article class="employee-card">
          <header>
            <div class="avatar-line">
              <span class="avatar">${initials(employee.name)}</span>
              <div>
                <strong>${employee.name}</strong>
                <span class="muted">${employee.region} · ${employee.map.label}</span>
              </div>
            </div>
            ${statusBadge}
          </header>
          <div class="progress-head">
            <span>今日目标进度</span>
            <b>${percent}%</b>
          </div>
          <div class="progress-track"><span class="progress-fill" style="--value:${percent}%"></span></div>
          <div class="timeline-meta">
            <button class="tag" type="button" data-detail="visits" data-employee="${employee.id}" title="查看今日拜访明细">已拜访 ${stats.visits} / 目标 ${employee.target}</button>
            <button class="tag" type="button" data-detail="leads" data-employee="${employee.id}" title="查看A/B类重点客户">重点客户 ${stats.leads} 条</button>
            <button class="tag" type="button" data-detail="photos" data-employee="${employee.id}" title="查看照片凭证明细">照片凭证 ${stats.photos} 张</button>
            ${draftTag}
          </div>
          <div class="tags">
            ${employee.route.map((route) => `<button class="tag" type="button" data-detail="route" data-employee="${employee.id}" data-route="${escapeHtml(route)}" title="查看这个路线点的记录">${escapeHtml(route)}</button>`).join("")}
          </div>
          <div class="form-actions">
            <button class="button secondary quick-log" type="button" data-employee="${employee.id}">新登记日志</button>
            ${latestDraft ? `<button class="button draft open-draft" type="button" data-draft="${escapeHtml(latestDraft.id)}">继续修改${activeRole === "employee" ? escapeHtml(currentVisitModeLabel()) : ""}草稿</button>` : ""}
          </div>
        </article>
      `;
    }).join("");
    renderEmployeeDraftTray();
  }

  function renderLogTable() {
    const searchValue = $("#logSearch").value.trim().toLowerCase();
    const statusValue = $("#statusFilter").value;
    const logs = logsForSelectedDate()
      .filter((log) => statusValue === "all" || log.result === statusValue)
      .filter((log) => {
        if (!searchValue) return true;
        const employee = getEmployee(log.employeeId);
        return [employee.name, displayBuilding(log), displayRoom(log), log.customer, log.phone, log.note]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchValue));
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (!logs.length) {
      $("#logTable").innerHTML = `
        <tr>
          <td colspan="11"><span class="muted">暂无符合筛选条件的拜访记录</span></td>
        </tr>
      `;
      return;
    }

    $("#logTable").innerHTML = logs.map((log) => {
      const employee = getEmployee(log.employeeId);
      const contactLevel = displayContactLevel(log);
      const siteLabel = contactLevel || displayReceptionResult(log) || "未填写";
      const siteBadgeClass = contactLevel ? contactLevelBadgeClass(contactLevel) : receptionBadgeClass(displayReceptionResult(log));
      const warning = state.rules.photoRequired && Number(log.photos || 0) < state.rules.minPhotos;
      return `
        <tr>
          <td>${formatTime(log.timestamp)}</td>
          <td>${employee.name}</td>
          <td>${displayBuilding(log)}</td>
          <td>${log.customer}<br><span class="muted">${contactTypeLabel(log.contactType)} · ${log.phone || "未留电话"}</span></td>
          <td><span class="badge ${siteBadgeClass}">${escapeHtml(siteLabel)}</span></td>
          <td><span class="badge ${renovationBadgeClass(log.result)}">${log.result}</span></td>
          <td>${displayCustomerType(log)}</td>
          <td>${displayRoom(log)}</td>
          <td>${log.photos || 0}</td>
          <td>${log.duration} 分钟</td>
          <td><span class="badge ${warning ? "danger" : "good"}">${warning ? "提交需复核" : "已提交锁定"}</span></td>
        </tr>
      `;
    }).join("");
  }

  function renderChangeLogs() {
    const list = $("#changeLogList");
    if (!list) return;
    const dateValue = $("#workDate")?.value || formatDate(new Date());
    const employeeIds = new Set(employeesForSelectedRegion().map((employee) => employee.id));
    const changes = (state.changeLogs || [])
      .filter((item) => sameDay(item.timestamp, dateValue))
      .filter((item) => employeeIds.has(item.employeeId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    $("#changeLogCount").textContent = `${changes.length} 条`;
    if (!changes.length) {
      list.innerHTML = `<article class="change-log-item"><strong>暂无员工修改记录</strong><span>员工修改成交客户资料后，会自动显示在这里。</span></article>`;
      return;
    }

    list.innerHTML = changes.map((item) => `
      <article class="change-log-item">
        <div class="change-log-head">
          <strong>${escapeHtml(item.customer || "未填写客户")} · ${escapeHtml(item.fieldLabel || "资料")}</strong>
          <time>${escapeHtml(formatDate(item.timestamp))} ${escapeHtml(formatTime(item.timestamp))}</time>
        </div>
        <div class="change-log-meta">
          <span>员工：${escapeHtml(item.employeeName || getEmployee(item.employeeId)?.name || "员工")}</span>
          <span>${escapeHtml([item.building, item.room].filter(Boolean).join(" · ") || "未记录地址")}</span>
        </div>
        <div class="change-log-change">
          <span>原来：${escapeHtml(item.oldValue || "空")}</span>
          <b>改为：${escapeHtml(item.newValue || "空")}</b>
        </div>
      </article>
    `).join("");
  }

  function renderLeads() {
    const stages = renovationStages.map((stage, index) => ({
      label: stage,
      color: renovationBadgeClass(stage)
    }));
    const logs = logsForSelectedDate().filter(isCustomerContactLog);

    $("#leadBoard").innerHTML = stages.map((stage) => {
      const items = logs.filter((log) => log.result === stage.label);
      return `
        <article class="lead-card">
          <header>
            <strong>${stage.label}</strong>
            <span class="badge ${stage.color}">${items.length}</span>
          </header>
          ${items.slice(0, 4).map((log) => {
            const employee = getEmployee(log.employeeId);
            return `<div><b>${log.customer}</b><div class="muted">负责人：${employee.name} · 来源：${displayBuilding(log)} ${displayRoom(log)}</div></div>`;
          }).join("") || `<div class="muted">暂无客户</div>`}
        </article>
      `;
    }).join("");
  }

  function renderStaff() {
    $("#staffList").innerHTML = employeesForSelectedRegion().map((employee) => {
      const stats = employeeStats(employee.id);
      const percent = Math.min(Math.round((stats.visits / employee.target) * 100), 100);
      return `
        <article class="staff-row">
          <header>
            <div class="avatar-line">
              <span class="avatar">${initials(employee.name)}</span>
              <div>
                <strong>${employee.name}</strong>
                <span class="muted">${employee.region} · ${employee.phone}</span>
              </div>
            </div>
            <span class="badge ${percent >= 80 ? "good" : "warn"}">${percent}%</span>
          </header>
          <div class="progress-head">
            <span>今日目标进度</span>
            <b>${percent}%</b>
          </div>
          <div class="progress-track"><span class="progress-fill" style="--value:${percent}%"></span></div>
          <div class="timeline-meta">
            <button class="tag" type="button" data-detail="visits" data-employee="${employee.id}" title="查看今日拜访明细">今日已拜访 ${stats.visits} 次</button>
            <button class="tag" type="button" data-detail="target" data-employee="${employee.id}" title="查看目标完成情况">目标 ${employee.target} 次</button>
            <button class="tag" type="button" data-detail="leads" data-employee="${employee.id}" title="查看A/B类重点客户">重点客户 ${stats.leads} 条</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function customerRecordKey(log) {
    const contactKey = log.phone || log.wechatName || log.wechatProof?.customerWechat || "";
    return [
      log.employeeId,
      contactKey || log.customer || "未知客户",
      displayBuilding(log),
      displayRoom(log)
    ].join("|").toLowerCase();
  }

  function setExistingField(target, field, value, options = {}) {
    const { overwrite = false } = options;
    if (value === undefined || value === null || value === "") return false;
    const oldValue = target[field] || "";
    if (!overwrite && oldValue) return false;
    if (String(oldValue) === String(value)) return false;
    target[field] = value;
    return true;
  }

  function syncAddressFields(target, source, options = {}) {
    const { overwrite = false } = options;
    let changed = false;
    changed = setExistingField(target, "property", source.property, { overwrite }) || changed;
    changed = setExistingField(target, "buildingNumber", source.buildingNumber, { overwrite }) || changed;
    changed = setExistingField(target, "unit", source.unit, { overwrite }) || changed;
    changed = setExistingField(target, "building", source.building || displayBuilding(source), { overwrite }) || changed;
    changed = setExistingField(target, "room", source.room || displayRoom(source), { overwrite }) || changed;
    changed = setExistingField(target, "floor", source.floor, { overwrite }) || changed;
    return changed;
  }

  function lifecycleStageForSource(sourceLog) {
    if (sourceLog?.visitType === "门店接待") {
      return storeVisitResultStage(sourceLog.storeResult || storeVisitResultFromStage(sourceLog.wechatStage));
    }
    const stage = normalizeCustomerFollowStage(sourceLog?.wechatStage);
    return stage;
  }

  function syncCustomerBasicsToLog(log, sourceLog, reason) {
    let changed = false;
    changed = setExistingField(log, "customer", sourceLog.customer) || changed;
    changed = setExistingField(log, "phone", sourceLog.phone, { overwrite: reason === "房号相同" }) || changed;
    changed = setExistingField(log, "wechatName", sourceLog.wechatName) || changed;
    changed = setExistingField(log, "wechatNameSource", sourceLog.wechatNameSource) || changed;
    if (sourceLog.result && sourceLog.result !== "暂不清楚" && log.result !== sourceLog.result) {
      log.result = sourceLog.result;
      changed = true;
    }
    if (!customerAddressKey(log) || ["电话相同", "房号相同"].includes(reason)) {
      changed = syncAddressFields(log, sourceLog, { overwrite: ["电话相同", "房号相同"].includes(reason) }) || changed;
    }
    return changed;
  }

  function upgradeLogFromCustomerLifecycle(log, sourceLog, reason, now) {
    let changed = false;
    const sourceStage = lifecycleStageForSource(sourceLog);
    const nextStage = highestCustomerFollowStage(log.wechatStage, sourceStage);
    if (normalizeCustomerFollowStage(log.wechatStage) !== nextStage) {
      log.wechatStage = nextStage;
      changed = true;
    }
    if (shouldForceCustomerTypeA(nextStage) && log.customerType !== "A类") {
      log.customerType = "A类";
      changed = true;
    }
    changed = syncCustomerBasicsToLog(log, sourceLog, reason) || changed;
    if (changed) {
      log.linkedCustomerLifecycleLogId = sourceLog.id;
      log.linkedCustomerLifecycleAt = now;
      log.customerLifecycleMatchReason = reason;
      if (sourceLog.visitType === "门店接待") {
        log.linkedStoreReceptionId = sourceLog.id;
        log.linkedStoreReceptionAt = now;
        log.storeReceptionMatchReason = reason;
      }
    }
    return changed;
  }

  function updateClosedRecordFromCustomerLifecycle(record, sourceLog, reason, now) {
    const employee = getEmployee(sourceLog.employeeId);
    const sourceStage = lifecycleStageForSource(sourceLog);
    const nextStage = highestCustomerFollowStage(record.customerFollowStage, sourceStage);
    let changed = false;
    const setRecordField = (field, label, value, options = {}) => {
      const { overwrite = true } = options;
      if (value === undefined || value === null || value === "") return;
      const oldValue = record[field] || "";
      if (!overwrite && oldValue) return;
      if (String(oldValue) === String(value)) return;
      record[field] = value;
      appendChangeLog(record, label, oldValue || "未记录", value, employee);
      changed = true;
    };

    setRecordField("customer", "客户姓名", sourceLog.customer, { overwrite: false });
    setRecordField("phone", "客户电话", sourceLog.phone);
    setRecordField("wechatName", "微信昵称", sourceLog.wechatName);
    if (sourceLog.result && sourceLog.result !== "暂不清楚") {
      setRecordField("result", "装修进度", sourceLog.result);
    }
    const shouldRefreshAddress = !customerAddressKey(record) || ["电话相同", "房号相同"].includes(reason);
    if (shouldRefreshAddress) {
      setRecordField("building", "小区楼栋", sourceLog.building || displayBuilding(sourceLog), { overwrite: ["电话相同", "房号相同"].includes(reason) });
      setRecordField("room", "房号", sourceLog.room || displayRoom(sourceLog), { overwrite: ["电话相同", "房号相同"].includes(reason) });
    }
    if (nextStage !== normalizeCustomerFollowStage(record.customerFollowStage)) {
      const oldStage = normalizeCustomerFollowStage(record.customerFollowStage);
      record.customerFollowStage = nextStage;
      appendChangeLog(record, "客户跟进阶段", oldStage, `${nextStage}（${reason}）`, employee);
      changed = true;
    }
    if (customerFollowStageRank(nextStage) >= customerFollowStageRank("已到过店")) {
      const oldStoreStatus = record.storeReceptionStatus || "未记录到店";
      if (oldStoreStatus !== "已到过店") {
        record.storeReceptionStatus = "已到过店";
        appendChangeLog(record, "到店状态", oldStoreStatus, `已到过店（${reason}）`, employee);
        changed = true;
      }
    }
    if (customerFollowStageRank(nextStage) >= customerFollowStageRank("已做过预算")) {
      const oldBudgetStatus = record.budgetStatus || "未做预算";
      if (oldBudgetStatus !== "已做过预算") {
        record.budgetStatus = "已做过预算";
        appendChangeLog(record, "预算状态", oldBudgetStatus, `已做过预算（${reason}）`, employee);
        changed = true;
      }
    }
    if (changed) {
      record.lastCustomerLifecycleLogId = sourceLog.id;
      record.lastCustomerLifecycleAt = now;
      if (sourceLog.visitType === "门店接待") {
        record.lastStoreReceptionLogId = sourceLog.id;
        record.lastStoreReceptionAt = now;
      }
    }
    return changed;
  }

  function syncCustomerLifecycleFromLog(sourceLog) {
    const result = { logs: 0, records: 0, changed: false, stage: lifecycleStageForSource(sourceLog) };
    if (!sourceLog || !isCustomerContactLog(sourceLog)) return result;
    const now = new Date().toISOString();
    state.logs.forEach((log) => {
      if (log.id === sourceLog.id) return;
      if (log.employeeId !== sourceLog.employeeId || !isCustomerContactLog(log)) return;
      const reason = customerIdentityMatchReason(sourceLog, log);
      if (!reason) return;
      if (upgradeLogFromCustomerLifecycle(log, sourceLog, reason, now)) {
        result.logs += 1;
        result.changed = true;
      }
    });

    state.closedCustomers.forEach((record) => {
      if (record.status !== "closed") return;
      if ((record.employeeId || sourceLog.employeeId) !== sourceLog.employeeId) return;
      const reason = customerIdentityMatchReason(sourceLog, record);
      if (!reason) return;
      if (updateClosedRecordFromCustomerLifecycle(record, sourceLog, reason, now)) {
        result.records += 1;
        result.changed = true;
      }
    });
    return result;
  }

  function syncStoreReceptionCustomer(storeLog) {
    return storeLog?.visitType === "门店接待" ? syncCustomerLifecycleFromLog(storeLog) : { logs: 0, records: 0, changed: false, stage: "" };
  }

  function stageAdvice(stage) {
    const advice = {
      "拆改": { type: "D类", action: "先建档", text: "刚开始装修，先留好微信电话，别急着硬推。" },
      "水电": { type: "C类", action: "问需求", text: "问清风格、预算、户型，先发案例。" },
      "瓷砖": { type: "B类", action: "发案例", text: "可以发家具搭配图，约客户后面看样。" },
      "木工": { type: "A类", action: "今天跟", text: "快到买家具时间了，今天联系客户。" },
      "油漆": { type: "A类", action: "今天跟", text: "墙面阶段，客户很快要看家具，重点跟。" },
      "吊顶": { type: "A类", action: "今天跟", text: "确认尺寸和风格，尽量约到店。" },
      "定制安装": { type: "A类", action: "今天跟", text: "定制柜阶段，正是家具成交窗口。" },
      "软装进场": { type: "A类", action: "马上跟", text: "需求很近，直接约看样或报价。" },
      "已入住": { type: "C类", action: "慢慢跟", text: "可能只补家具，保持联系即可。" },
      "暂不清楚": { type: "D类", action: "再确认", text: "先确认装修进度，再判断要不要重点跟。" }
    };
    return advice[stage] || advice["暂不清楚"];
  }

  function customerFollowAdvice(log, fallback) {
    const stage = normalizeCustomerFollowStage(log.wechatStage);
    if (stage === "已成交") {
      return { type: "A类", action: "已成交", text: "客户已经成交，后续转入成交客户维护。" };
    }
    if (stage === "已做过预算") {
      return { type: "A类", action: "预算客户", text: "已经做过预算，属于高意向客户，优先报价和促成交。" };
    }
    if (stage === "已到过店") {
      return { type: "A类", action: "到店客户", text: "客户已经到过店，不能降级，优先安排回访和邀约。" };
    }
    if (log.customerType === "A类") {
      return { ...fallback, type: "A类", action: fallback.action === "先建档" ? "重点跟" : fallback.action };
    }
    return fallback;
  }

  function invalidRequestForKey(key) {
    return state.invalidRequests
      .filter((request) => request.customerKey === key)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }

  function customerRecords(employeeId) {
    const groups = new Map();
    state.logs
      .filter((log) => log.employeeId === employeeId && log.customer && isCustomerContactLog(log))
      .forEach((log) => {
        const key = customerRecordKey(log);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(log);
      });

    return Array.from(groups.entries()).map(([key, logs]) => {
      const sorted = logs.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const latest = sorted[sorted.length - 1];
      const first = sorted[0];
      const advice = customerFollowAdvice(latest, stageAdvice(latest.result));
      const request = invalidRequestForKey(key);
      const closedCustomer = closedCustomerForKey(key);
      const staleDays = daysSince(latest.timestamp);
      const approvedInvalid = request?.status === "approved";
      const shouldFollow = !approvedInvalid && !closedCustomer && (["A类", "B类"].includes(advice.type) || staleDays >= 7);
      return {
        key,
        logs: sorted,
        latest,
        first,
        advice,
        invalidRequest: request,
        closedCustomer,
        approvedInvalid,
        days: staleDays,
        shouldFollow,
        searchText: [
          latest.customer,
          latest.phone,
          latest.wechatName,
          latest.wechatProof?.customerWechat,
          displayBuilding(latest),
          displayRoom(latest),
          latest.note
        ].filter(Boolean).join(" ").toLowerCase()
      };
    }).sort((a, b) => {
      const aPending = a.invalidRequest?.status === "pending" ? 1 : 0;
      const bPending = b.invalidRequest?.status === "pending" ? 1 : 0;
      const aHot = a.advice.type === "A类" ? 1 : 0;
      const bHot = b.advice.type === "A类" ? 1 : 0;
      return (bPending - aPending) || (bHot - aHot) || (Number(b.shouldFollow) - Number(a.shouldFollow)) || (new Date(b.latest.timestamp) - new Date(a.latest.timestamp));
    });
  }

  function filteredCustomerRecords() {
    const employeeId = currentEmployeeId();
    const filter = $("#customerTrackerFilter")?.value || "all";
    const search = ($("#customerTrackerSearch")?.value || "").trim().toLowerCase();
    return customerRecords(employeeId).filter((record) => {
      if (filter === "hot" && (record.advice.type !== "A类" || record.closedCustomer)) return false;
      if (filter === "todo" && !record.shouldFollow) return false;
      if (filter === "invalid" && record.invalidRequest?.status !== "pending") return false;
      if (filter === "closed" && !record.closedCustomer) return false;
      if (search && !record.searchText.includes(search)) return false;
      return true;
    });
  }

  function renderCustomerTrackerOptions() {
    return currentEmployeeId();
  }

  function renderCustomerTracker() {
    if (!$("#customerTrackerList")) return;
    const employeeId = renderCustomerTrackerOptions();
    const allRecords = customerRecords(employeeId);
    const records = filteredCustomerRecords();
    const hotCount = allRecords.filter((record) => record.advice.type === "A类" && !record.closedCustomer).length;
    const todoCount = allRecords.filter((record) => record.shouldFollow).length;
    const invalidCount = allRecords.filter((record) => record.invalidRequest?.status === "pending").length;
    const closedCount = allRecords.filter((record) => record.closedCustomer).length;

    $("#customerTrackerSummary").innerHTML = [
      { label: "今天要跟", value: todoCount, filter: "todo", tone: "good" },
      { label: "A类重点", value: hotCount, filter: "hot", tone: "info" },
      { label: "无效待审", value: invalidCount, filter: "invalid", tone: "warn" },
      { label: "已成交", value: closedCount, filter: "closed", tone: "good" }
    ].map((item) => `
      <button class="summary-action ${item.tone}" type="button" data-customer-filter="${item.filter}">
        <strong>${item.value}</strong>
        <span>${item.label}</span>
      </button>
    `).join("");

    if (!records.length) {
      activeCustomerKey = "";
      $("#customerTrackerList").innerHTML = `<div class="detail-empty">当前没有客户，员工提交拜访日志后会自动汇总到这里。</div>`;
      renderCustomerTrackerDetail(null);
      return;
    }

    if (!records.some((record) => record.key === activeCustomerKey)) {
      activeCustomerKey = records[0].key;
    }

    $("#customerTrackerList").innerHTML = records.map((record) => {
      const latest = record.latest;
      const pending = record.invalidRequest?.status === "pending";
      const approvedInvalid = record.invalidRequest?.status === "approved";
      const closed = Boolean(record.closedCustomer);
      return `
        <button class="customer-card ${record.key === activeCustomerKey ? "active" : ""}" type="button" data-customer-key="${escapeHtml(record.key)}">
          <span class="customer-card-main">
            <b>${escapeHtml(latest.customer)}</b>
            <small>${escapeHtml(displayBuilding(latest))} · ${escapeHtml(displayRoom(latest))}</small>
          </span>
          <span class="customer-card-side">
            <em class="${record.advice.type === "A类" && !approvedInvalid && !closed ? "hot" : ""}">${closed ? "已成交" : approvedInvalid ? "已无效" : pending ? "待审核" : record.advice.action}</em>
            <small>${escapeHtml(latest.result)} · ${closed ? "成交客户" : approvedInvalid ? "无效客户" : pending ? "无效待审" : record.advice.type}</small>
          </span>
        </button>
      `;
    }).join("");

    renderCustomerTrackerDetail(records.find((record) => record.key === activeCustomerKey));
  }

  function renderCustomerTrackerDetail(record) {
    const detail = $("#customerTrackerDetail");
    if (!detail) return;
    if (!record) {
      detail.innerHTML = `<div class="detail-empty">点左边客户卡片，这里会显示跟进重点。</div>`;
      return;
    }

    const latest = record.latest;
    const employee = getEmployee(latest.employeeId);
    const pending = record.invalidRequest?.status === "pending";
    const approvedInvalid = record.invalidRequest?.status === "approved";
    const closed = Boolean(record.closedCustomer);
    const timeline = record.logs.slice(-5).reverse().map((log) => `
      <div class="simple-step">
        <b>${formatDate(log.timestamp)}</b>
        <span>${escapeHtml(log.result)} · ${escapeHtml(log.reception || "未填现场")}</span>
        <small>${escapeHtml(log.note || "没有备注")}</small>
      </div>
    `).join("");

    detail.innerHTML = `
      <article class="customer-focus ${record.advice.type === "A类" && !approvedInvalid && !closed ? "hot" : ""}">
        <div>
          <p>下一步</p>
          <strong>${closed ? "已成交客户，不再进入老客户回访名单" : approvedInvalid ? "老板已通过无效客户，不用继续跟进" : pending ? "等老板审核无效客户" : record.advice.text}</strong>
        </div>
        <span>${closed ? "已成交" : approvedInvalid ? "已无效" : pending ? "待审" : record.advice.type}</span>
      </article>

      <div class="customer-facts">
        <div><span>客户</span><b>${escapeHtml(latest.customer)}</b></div>
        <div><span>电话</span><b>${escapeHtml(latest.phone || "未留")}</b></div>
        <div><span>微信</span><b>${escapeHtml(displayWechatAdded(latest))}</b></div>
        <div><span>跟进</span><b>${record.logs.length} 次</b></div>
      </div>

      <article class="simple-card">
        <h3>最近情况</h3>
        <p>${escapeHtml(latest.note || "没有备注")}</p>
        <div class="tags">
          <span class="tag">${escapeHtml(displayBuilding(latest))}</span>
          <span class="tag">${escapeHtml(displayRoom(latest))}</span>
          <span class="tag">${escapeHtml(latest.result)}</span>
          <span class="tag">负责人：${escapeHtml(employee?.name || "未匹配")}</span>
        </div>
      </article>

      <article class="simple-card">
        <h3>历史记录</h3>
        <div class="simple-timeline">${timeline}</div>
      </article>

      <div class="mobile-actions">
        <button class="button primary" type="button" data-start-return="${escapeHtml(record.key)}" ${closed ? "disabled" : ""}>${closed ? "已成交" : "登记回访"}</button>
        <button class="button secondary danger-action" type="button" data-request-invalid="${escapeHtml(record.key)}" ${closed || pending || approvedInvalid ? "disabled" : ""}>${closed ? "已成交" : approvedInvalid ? "已无效" : pending ? "已申请无效" : "申请无效"}</button>
        <button class="button secondary" type="button" data-close-customer="${escapeHtml(latest.id)}" ${closed || approvedInvalid ? "disabled" : ""}>${closed ? "已成交" : "转已成交"}</button>
      </div>
    `;
  }

  function closedCustomerSourceLog(record) {
    const directLog = record?.sourceLogId ? getLog(record.sourceLogId) : null;
    if (directLog) return directLog;
    if (!record?.customerKey) return null;
    return state.logs
      .filter((log) => isCustomerContactLog(log) && customerRecordKey(log) === record.customerKey)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;
  }

  function closedCustomerRecords(employeeId = currentEmployeeId(), options = {}) {
    const seen = new Set();
    const records = state.closedCustomers
      .map((record) => {
        const sourceLog = closedCustomerSourceLog(record);
        return {
          record,
          sourceLog,
          employeeId: record.employeeId || sourceLog?.employeeId || ""
        };
      })
      .filter((item) => item.record.status === "closed" && item.employeeId === employeeId)
      .sort((a, b) => new Date(b.record.closedAt) - new Date(a.record.closedAt))
      .filter((item) => {
        const key = item.record.customerKey || `${item.record.customer}|${item.record.phone}|${item.record.building}|${item.record.room}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    return options.includeInstalled ? records : records.filter((item) => !isInstalledPaidRecord(item.record));
  }

  function isInstalledPaidRecord(record) {
    return normalizeAfterSaleStatus(record?.afterSaleStatus) === installedPaidStatus || Boolean(record?.installedPaidAt);
  }

  function afterSaleCustomerRecords(employeeId = currentEmployeeId()) {
    return closedCustomerRecords(employeeId, { includeInstalled: true })
      .filter((item) => !isInstalledPaidRecord(item.record) || hasActiveAfterSaleIssue(item.record));
  }

  function installedPaidCustomerRecords(employeeId = currentEmployeeId()) {
    return closedCustomerRecords(employeeId, { includeInstalled: true })
      .filter((item) => isInstalledPaidRecord(item.record))
      .sort((a, b) => closedCustomerRecentTime(b, "installedPaid") - closedCustomerRecentTime(a, "installedPaid"));
  }

  function closedCustomerDisplay(item) {
    const { record, sourceLog } = item || {};
    return {
      name: record?.customer || sourceLog?.customer || "未填写姓名",
      phone: record?.phone || sourceLog?.phone || "未留电话",
      building: record?.building || (sourceLog ? displayBuilding(sourceLog) : "未记录小区"),
      room: record?.room || (sourceLog ? displayRoom(sourceLog) : "未记录房号"),
      result: record?.result || sourceLog?.result || "未记录进度",
      note: record?.note || sourceLog?.note || "已成交客户，后续可做售后维护。"
    };
  }

  function closedCustomerSearchText(item) {
    const { record, sourceLog } = item;
    return [
      record.customer,
      record.phone,
      record.wechatName,
      record.building,
      record.room,
      record.result,
      record.note,
      record.orderAmount,
      record.depositAmount,
      record.afterSaleStatus,
      record.afterSaleIssueStatus,
      sourceLog?.customer,
      sourceLog?.phone,
      sourceLog?.wechatName,
      sourceLog ? displayBuilding(sourceLog) : "",
      sourceLog ? displayRoom(sourceLog) : "",
      sourceLog?.note
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function selectedClosedCustomerItem(records = closedCustomerRecords()) {
    return records.find((item) => item.record.id === activeClosedCustomerId) || null;
  }

  function closedCustomerAreaProperty(item) {
    const display = closedCustomerDisplay(item);
    const sourceLog = item?.sourceLog || {};
    const directProperty = item?.record?.property || sourceLog.property;
    if (directProperty) return directProperty;
    const building = display.building || item?.record?.building || sourceLog.building || "";
    const parsed = building.replace(/\s*\d{1,2}\s*(栋|幢|号楼|楼).*/, "").trim();
    return parsed || building || "未记录小区";
  }

  function closedCustomerAreaBuilding(item) {
    const sourceLog = item?.sourceLog || {};
    return item?.record?.buildingNumber
      || sourceLog.buildingNumber
      || coerceBuildingNumber(item?.record?.building || sourceLog.building || closedCustomerDisplay(item).building, "未记录楼栋");
  }

  function closedCustomerRecentTime(item, context = "closed") {
    const record = item?.record || {};
    const sourceLog = item?.sourceLog || {};
    const date = context === "installedPaid"
      ? record.installedPaidAt || record.afterSaleUpdatedAt || record.closedAt || sourceLog.timestamp
      : context === "afterSale"
        ? record.afterSaleUpdatedAt || record.closedAt || sourceLog.timestamp
        : record.dealArchiveUpdatedAt || record.closedAt || sourceLog.timestamp;
    return new Date(date || 0).getTime();
  }

  function renderLifecycleCustomerCards(records, activeId, dataAttribute, context, emptyText) {
    if (!records.length) {
      return `<div class="detail-empty">${escapeHtml(emptyText)}</div>`;
    }
    return records.map((item) => {
      const { record } = item;
      const display = closedCustomerDisplay(item);
      const footer = context === "installedPaid"
        ? `已安装收尾款 · ${record.installedPaidAt ? `${formatDate(record.installedPaidAt)} ${formatTime(record.installedPaidAt)}` : "已归档"}`
        : context === "afterSale"
          ? `${normalizeAfterSaleStatus(record.afterSaleStatus)} · ${normalizeAfterSaleIssueStatus(record.afterSaleIssueStatus)}`
          : `${display.result} · ${record.orderAmount ? `订单 ${record.orderAmount}` : "待补成交金额"}`;
      return `
        <article class="customer-result-card ${record.id === activeId ? "active" : ""}">
          <button class="customer-result-open" type="button" data-${dataAttribute}="${escapeHtml(record.id)}">
            <strong>${escapeHtml(display.name)}</strong>
            <span>${escapeHtml([display.phone, display.building, display.room].filter(Boolean).join(" · "))}</span>
            <small>${escapeHtml(footer)}</small>
          </button>
        </article>
      `;
    }).join("");
  }

  function filterLifecycleCustomerRecords(records, query, template, filters, context = "closed") {
    const searchableRecords = records.filter((item) => !query || closedCustomerSearchText(item).includes(query));
    if (template === "area") {
      const properties = uniqueValues(searchableRecords.map(closedCustomerAreaProperty));
      if (filters.property && !properties.includes(filters.property)) filters.property = "";
      const propertyValue = filters.property || properties[0] || "";
      const propertyRecords = propertyValue
        ? searchableRecords.filter((item) => closedCustomerAreaProperty(item) === propertyValue)
        : searchableRecords;
      const buildings = uniqueValues(propertyRecords.map(closedCustomerAreaBuilding));
      if (filters.building && !buildings.includes(filters.building)) filters.building = "";
      const buildingValue = filters.building || buildings[0] || "";
      filters.property = propertyValue;
      filters.building = buildingValue;
      return {
        records: buildingValue
          ? propertyRecords.filter((item) => closedCustomerAreaBuilding(item) === buildingValue)
          : propertyRecords,
        controls: properties.length ? `
          <div class="resource-filter-row">
            <select id="${context === "installedPaid" ? "installedPaidPropertyFilter" : context === "afterSale" ? "afterSalePropertyFilter" : "closedCustomerPropertyFilter"}">
              ${properties.map((property) => `<option value="${escapeHtml(property)}" ${property === propertyValue ? "selected" : ""}>${escapeHtml(property)}</option>`).join("")}
            </select>
            <select id="${context === "installedPaid" ? "installedPaidBuildingFilter" : context === "afterSale" ? "afterSaleBuildingFilter" : "closedCustomerBuildingFilter"}">
              ${buildings.map((building) => `<option value="${escapeHtml(building)}" ${building === buildingValue ? "selected" : ""}>${escapeHtml(building)}</option>`).join("")}
            </select>
          </div>
        ` : "",
        summaryLabel: propertyValue && buildingValue
          ? `${propertyValue} ${buildingValue}`
          : "小区筛选"
      };
    }

    if (template === "recent") {
      return {
        records: searchableRecords.slice().sort((a, b) => closedCustomerRecentTime(b, context) - closedCustomerRecentTime(a, context)).slice(0, 8),
        controls: "",
        summaryLabel: "最近优先"
      };
    }

    return {
      records: searchableRecords,
      controls: "",
      summaryLabel: "搜索列表"
    };
  }

  function renderDealImageArchive(record) {
    const cached = dealImagePreviews.get(record.id) || [];
    const cachedNames = new Set(cached.map((item) => item.name));
    const storedNames = normalizeFileNames(record.dealImageNames, record.dealImageName)
      .filter((name) => !cachedNames.has(name));
    const total = cached.length + storedNames.length;
    const addTile = total < 6
      ? `
        <button class="upload-add-tile deal-image-add" type="button" data-deal-image-trigger>
          <svg><use href="#icon-camera"></use></svg>
          <span>${total ? "继续添加" : "添加成交图"}</span>
          <small>最多 6 张</small>
        </button>
      `
      : "";
    const cachedTiles = cached.map((item, index) => `
      <div class="upload-thumb">
        <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.name)}" />
        <span class="upload-thumb-label">成交图 ${index + 1}</span>
      </div>
    `).join("");
    const storedTiles = storedNames.map((name, index) => `
      <div class="upload-thumb is-placeholder is-compact-record">
        <span class="upload-thumb-label">${escapeHtml(name)}</span>
      </div>
    `).join("");
    return addTile + cachedTiles + storedTiles || `
      <button class="upload-add-tile deal-image-add" type="button" data-deal-image-trigger>
        <svg><use href="#icon-camera"></use></svg>
        <span>添加成交图</span>
        <small>合同/收款/订单</small>
      </button>
    `;
  }

  function renderDealImageArchiveReadOnly(record) {
    const storedNames = normalizeFileNames(record.dealImageNames, record.dealImageName);
    if (!storedNames.length) {
      return `<div class="detail-empty">暂无成交或安装图片。</div>`;
    }
    return storedNames.map((name, index) => `
      <div class="upload-thumb is-placeholder is-compact-record">
        <span class="upload-thumb-label">${escapeHtml(name || `存档图 ${index + 1}`)}</span>
      </div>
    `).join("");
  }

  function renderInlineSelect(options, value, attrs = "") {
    return `
      <select class="lifecycle-inline-select" ${attrs}>
        ${options.map((item) => `<option value="${escapeHtml(item)}" ${item === value ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
      </select>
    `;
  }

  function renderClosedCustomerDetail(item) {
    const detail = $("#closedCustomerDetail");
    if (!detail) return;
    if (!item) {
      detail.innerHTML = `<div class="detail-empty">先选择一个已成交客户，再维护成交图片和订单金额。</div>`;
      return;
    }

    const { record, sourceLog } = item;
    const display = closedCustomerDisplay(item);
    const closedAt = record.closedAt ? `${formatDate(record.closedAt)} ${formatTime(record.closedAt)}` : "未记录时间";
    const archiveDraft = normalizeDealArchiveDraft(record.dealArchiveDraft);
    const archiveValues = archiveDraft || record;
    const salesShareRatio = normalizeSalesShareRatio(archiveValues.salesShareRatio);
    const commissionPoints = normalizeCommissionPoints(archiveValues.commissionPoints);
    const dealAmounts = dealArchiveAmounts(archiveValues.orderAmount, salesShareRatio, commissionPoints);
    const commissionLocked = employeeCommissionLocked();
    const orderChangeRequest = pendingOrderChangeRequest(record.id);
    detail.innerHTML = `
      <article class="closed-customer-card closed-customer-detail-card lifecycle-info-card">
        <div class="lifecycle-card-title">
          <strong>客户资料</strong>
          <b>已成交</b>
        </div>
        <div class="lifecycle-identity">
          <div class="lifecycle-identity-main">
            <strong>${escapeHtml(display.name)}</strong>
            <span>电话：${escapeHtml(display.phone)}</span>
          </div>
          <label class="deal-source-field">
            <span>客户来源</span>
            <select data-closed-edit="${escapeHtml(record.id)}" data-closed-field="dealSource">
              ${dealSourceOptions.map((item) => `<option value="${escapeHtml(item)}" ${item === normalizeDealSource(record.dealSource) ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="lifecycle-fact-list">
          <div class="lifecycle-fact-row">
            <span>地址</span>
            <b>${escapeHtml([display.building, display.room].filter(Boolean).join(" · "))}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>装修进度</span>
            <b>${renderInlineSelect(
              renovationStages,
              renovationStages.includes(display.result) ? display.result : "暂不清楚",
              `data-closed-edit="${escapeHtml(record.id)}" data-closed-field="result"`
            )}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>成交时间</span>
            <b>${escapeHtml(closedAt)}</b>
          </div>
        </div>
        <div class="lifecycle-card-actions">
          <button class="closed-record-button lifecycle-record-button" type="button" data-closed-log="${escapeHtml(sourceLog?.id || "")}" ${sourceLog ? "" : "disabled"}>查看拜访记录</button>
        </div>
      </article>

      <article class="deal-archive-panel lifecycle-operation-card">
        <div class="deal-archive-head">
          <strong>成交图片存档</strong>
          <small>合同、收款、订单截图</small>
        </div>
        <input class="native-file-input" id="dealImageInput" type="file" accept="image/*" multiple />
        <div class="upload-thumb-grid deal-image-grid" id="dealImagePreview">${renderDealImageArchive(record)}</div>
      </article>

      <article class="deal-archive-panel lifecycle-operation-card">
        <div class="deal-archive-head">
          <strong>成交金额和提成</strong>
          <small>${commissionLocked ? "金额可填，提成需老板权限" : "金额手写，比例下拉"}</small>
        </div>
        <div class="deal-field-grid">
          <label class="field">
            <span>订单总额度</span>
            <input id="dealOrderAmount" type="number" inputmode="decimal" min="0" placeholder="手写金额" value="${escapeHtml(archiveValues.orderAmount || "")}" />
          </label>
          <label class="field">
            <span>已交定金</span>
            <input id="dealDepositAmount" type="number" inputmode="decimal" min="0" placeholder="手写金额" value="${escapeHtml(archiveValues.depositAmount || "")}" />
          </label>
          <div class="field deal-choice-field">
            <span>销售分成比例${commissionLocked ? " · 老板权限" : ""}</span>
            <input id="dealSalesShareRatio" type="hidden" value="${escapeHtml(salesShareRatio)}" />
            <div class="deal-choice-grid ${commissionLocked ? "is-locked" : ""}" data-deal-choice-group="salesShareRatio">
              ${salesShareRatios.map((item) => `<button class="deal-choice-button ${item === salesShareRatio ? "active" : ""}" type="button" data-deal-choice-field="dealSalesShareRatio" data-deal-choice-value="${escapeHtml(item)}" ${commissionLocked ? "aria-disabled=\"true\"" : ""}>${escapeHtml(item)}</button>`).join("")}
            </div>
          </div>
          <div class="deal-calculated-field" aria-live="polite">
            <span>分成金额</span>
            <b id="dealShareAmountView">${escapeHtml(moneyText(dealAmounts.shareAmount))}</b>
          </div>
          <div class="field deal-choice-field">
            <span>销售提成点数${commissionLocked ? " · 老板权限" : ""}</span>
            <input id="dealCommissionPoints" type="hidden" value="${escapeHtml(commissionPoints)}" />
            <div class="deal-choice-grid ${commissionLocked ? "is-locked" : ""}" data-deal-choice-group="commissionPoints">
              ${commissionPointOptions.map((item) => `<button class="deal-choice-button ${item === commissionPoints ? "active" : ""}" type="button" data-deal-choice-field="dealCommissionPoints" data-deal-choice-value="${escapeHtml(item)}" ${commissionLocked ? "aria-disabled=\"true\"" : ""}>${escapeHtml(item)}</button>`).join("")}
            </div>
          </div>
          <div class="deal-calculated-field deal-calculated-field-strong" aria-live="polite">
            <span>提成金额</span>
            <b id="dealCommissionAmountView">${escapeHtml(moneyText(dealAmounts.commissionAmount))}</b>
          </div>
          <label class="field deal-change-field">
            <span>是否改单</span>
            <select id="dealOrderChangeStatus">
              ${orderChangeStatuses.map((item) => `<option value="${escapeHtml(item)}" ${item === normalizeOrderChangeStatus(record.orderChangeStatus) ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
            </select>
          </label>
        </div>
        ${archiveDraft ? `<div class="deal-draft-hint">有未提交草稿，确认无误后再提交成交档案。</div>` : ""}
        ${orderChangeRequest ? `<div class="deal-approval-hint">改单“${escapeHtml(orderChangeRequest.requestedStatus)}”正在等老板审批，通过后才会生效。</div>` : ""}
        <div class="deal-archive-actions">
          <button class="button secondary" type="button" data-save-closed-draft="${escapeHtml(record.id)}">保存草稿</button>
          <button class="button primary deal-archive-save" type="button" data-save-closed-archive="${escapeHtml(record.id)}">提交成交档案</button>
        </div>
      </article>
    `;
  }

  function renderClosedCustomers() {
    if (!$("#closedCustomerList")) return;
    const query = ($("#closedCustomerSearch")?.value || "").trim().toLowerCase();
    const allRecords = closedCustomerRecords();
    $$("[data-closed-template]").forEach((button) => {
      button.classList.toggle("active", button.dataset.closedTemplate === closedCustomerTemplate);
    });
    const templateResult = filterLifecycleCustomerRecords(
      allRecords,
      query,
      closedCustomerTemplate,
      closedCustomerFilters,
      "closed"
    );
    const filteredRecords = templateResult.records;
    const controls = $("#closedCustomerTemplateControls");
    if (controls) controls.innerHTML = templateResult.controls;

    if (!allRecords.some((item) => item.record.id === activeClosedCustomerId)) {
      activeClosedCustomerId = allRecords[0]?.record.id || "";
    }
    if (filteredRecords.length && !filteredRecords.some((item) => item.record.id === activeClosedCustomerId)) {
      activeClosedCustomerId = filteredRecords[0].record.id;
    }
    const selectedItem = selectedClosedCustomerItem(allRecords);

    $("#closedCustomerCount").textContent = allRecords.length
      ? `${filteredRecords.length}/${allRecords.length} 个`
      : "0 个";
    $("#closedCustomerCascadeText").textContent = lifecyclePickerButtonText("closed", isLifecyclePickerOpen("closed"), allRecords.length);
    $("#closedCustomerResultSummary").textContent = allRecords.length
      ? `${templateResult.summaryLabel}，找到 ${filteredRecords.length} 个成交客户`
      : "暂无成交客户";

    if (!allRecords.length) {
      $("#closedCustomerList").innerHTML = `
        <div class="detail-empty">还没有已成交客户。老客户回访里把“客户跟进阶段”选为“已成交”并提交后，会自动进入这里。</div>
      `;
      renderClosedCustomerDetail(null);
      return;
    }

    if (!filteredRecords.length) {
      $("#closedCustomerList").innerHTML = `<div class="detail-empty">没有匹配的成交客户，换姓名、电话、小区或房号再搜。</div>`;
      renderClosedCustomerDetail(selectedItem);
      return;
    }

    $("#closedCustomerList").innerHTML = renderLifecycleCustomerCards(
      filteredRecords,
      activeClosedCustomerId,
      "closed-customer",
      "closed",
      "没有匹配的成交客户，换姓名、电话、小区或房号再搜。"
    );
    renderClosedCustomerDetail(selectedItem);
  }

  function activeClosedCustomerRecord() {
    return state.closedCustomers.find((record) => record.id === activeClosedCustomerId) || null;
  }

  function pendingOrderChangeRequest(recordId) {
    return state.orderChangeRequests.find((request) => request.recordId === recordId && request.status === "pending") || null;
  }

  function appendChangeLog(record, fieldLabel, oldValue, newValue, employeeOverride = null) {
    const employee = employeeOverride || currentEmployee();
    state.changeLogs.unshift({
      id: `change-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: new Date().toISOString(),
      employeeId: employee?.id || currentEmployeeId(),
      employeeName: employee?.name || "员工",
      recordId: record.id,
      customer: record.customer || "未填写客户",
      phone: record.phone || "",
      building: record.building || "",
      room: record.room || "",
      fieldLabel,
      oldValue,
      newValue
    });
  }

  function updateClosedCustomerField(recordId, field, value) {
    const record = state.closedCustomers.find((item) => item.id === recordId);
    if (!record) {
      showToast("没有找到这个成交客户");
      return;
    }

    if (field === "result") {
      const nextValue = renovationStages.includes(value) ? value : "暂不清楚";
      const oldValue = record.result || "暂不清楚";
      if (oldValue === nextValue) return;
      record.result = nextValue;
      appendChangeLog(record, "装修进度", oldValue, nextValue);
    } else if (field === "dealLifecycleStatus") {
      const nextValue = normalizeDealLifecycleStatus(value) || closedDealStatusText(record);
      const oldValue = closedDealStatusText(record);
      if (oldValue === nextValue) return;
      record.dealLifecycleStatus = nextValue;
      record.afterSaleStatus = dealStatusToAfterSaleStatus(nextValue);
      record.afterSaleUpdatedAt = new Date().toISOString();
      appendChangeLog(record, "说明", oldValue, nextValue);
    } else if (field === "dealSource") {
      const nextValue = normalizeDealSource(value);
      const oldValue = normalizeDealSource(record.dealSource);
      if (oldValue === nextValue) return;
      record.dealSource = nextValue;
      appendChangeLog(record, "客户来源", oldValue, nextValue);
    } else {
      return;
    }

    saveState();
    renderClosedCustomers();
    renderAfterSaleCustomers();
    renderInstalledPaidCustomers();
    renderChangeLogs();
    showToast("已保存修改，后台可查看记录");
  }

  function readClosedArchiveFields(record) {
    const draft = normalizeDealArchiveDraft(record.dealArchiveDraft) || {};
    return {
      orderAmount: ($("#dealOrderAmount")?.value || draft.orderAmount || record.orderAmount || "").trim(),
      depositAmount: ($("#dealDepositAmount")?.value || draft.depositAmount || record.depositAmount || "").trim(),
      salesShareRatio: normalizeSalesShareRatio($("#dealSalesShareRatio")?.value || draft.salesShareRatio || record.salesShareRatio),
      commissionPoints: normalizeCommissionPoints($("#dealCommissionPoints")?.value || draft.commissionPoints || record.commissionPoints),
      orderChangeStatus: normalizeOrderChangeStatus($("#dealOrderChangeStatus")?.value || draft.orderChangeStatus || record.orderChangeStatus)
    };
  }

  function saveClosedArchiveDraft(recordId, options = {}) {
    const { toast = true, rerender = true } = options;
    const record = state.closedCustomers.find((item) => item.id === recordId);
    if (!record) {
      if (toast) showToast("没有找到这个成交客户");
      return false;
    }
    record.dealArchiveDraft = readClosedArchiveFields(record);
    record.dealArchiveDraftUpdatedAt = new Date().toISOString();
    saveState();
    if (rerender) {
      renderClosedCustomers();
      renderInstalledPaidCustomers();
    }
    if (toast) showToast("成交档案草稿已保存");
    return true;
  }

  function requestOrderChangeApproval(record, archiveFields) {
    const employee = currentEmployee();
    const requestedStatus = normalizeOrderChangeStatus(archiveFields.orderChangeStatus);
    const currentStatus = normalizeOrderChangeStatus(record.orderChangeStatus);
    const existing = state.orderChangeRequests.find((item) => item.recordId === record.id && item.status === "pending");
    const payload = {
      recordId: record.id,
      employeeId: employee?.id || currentEmployeeId(),
      employeeName: employee?.name || "员工",
      customer: record.customer || "未填写客户",
      phone: record.phone || "",
      building: record.building || "",
      room: record.room || "",
      currentStatus,
      requestedStatus,
      archiveFields,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    if (existing) {
      Object.assign(existing, payload, {
        updatedAt: new Date().toISOString()
      });
      return existing;
    }
    const request = {
      id: `order-change-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...payload
    };
    state.orderChangeRequests.unshift(request);
    return request;
  }

  function saveClosedArchive(recordId, options = {}) {
    const { toast = true, rerender = true } = options;
    const record = state.closedCustomers.find((item) => item.id === recordId);
    if (!record) {
      if (toast) showToast("没有找到这个成交客户");
      return false;
    }
    const archiveFields = readClosedArchiveFields(record);
    if (activeRole === "employee"
      && orderChangeNeedsApproval(archiveFields.orderChangeStatus)
      && archiveFields.orderChangeStatus !== normalizeOrderChangeStatus(record.orderChangeStatus)) {
      requestOrderChangeApproval(record, archiveFields);
      Object.assign(record, {
        ...archiveFields,
        orderChangeStatus: normalizeOrderChangeStatus(record.orderChangeStatus),
        dealArchiveUpdatedAt: new Date().toISOString()
      });
      delete record.dealArchiveDraft;
      delete record.dealArchiveDraftUpdatedAt;
      saveState();
      if (rerender) {
        renderClosedCustomers();
        renderInstalledPaidCustomers();
        renderWarnings();
        renderMetrics();
      }
      if (toast) showToast("改单已提交老板审批，通过后生效");
      return true;
    }
    const oldOrderChangeStatus = normalizeOrderChangeStatus(record.orderChangeStatus);
    const pendingOrderChange = pendingOrderChangeRequest(record.id);
    if (pendingOrderChange && pendingOrderChange.requestedStatus !== archiveFields.orderChangeStatus) {
      pendingOrderChange.status = "cancelled";
      pendingOrderChange.reviewedAt = new Date().toISOString();
    }
    Object.assign(record, archiveFields, {
      dealArchiveUpdatedAt: new Date().toISOString()
    });
    delete record.dealArchiveDraft;
    delete record.dealArchiveDraftUpdatedAt;
    if (oldOrderChangeStatus !== record.orderChangeStatus) {
      appendChangeLog(record, "是否改单", oldOrderChangeStatus, record.orderChangeStatus);
    }
    saveState();
    if (rerender) {
      renderClosedCustomers();
      renderAfterSaleCustomers();
      renderInstalledPaidCustomers();
      renderChangeLogs();
    }
    if (toast) showToast("成交档案已保存");
    return true;
  }

  function handleDealImageUpload() {
    const record = activeClosedCustomerRecord();
    const input = $("#dealImageInput");
    if (!record || !input) return;
    saveClosedArchiveDraft(record.id, { toast: false, rerender: false });
    const files = Array.from(input.files || []).slice(0, 6);
    if (!files.length) return;
    const oldPreviews = dealImagePreviews.get(record.id) || [];
    oldPreviews.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    dealImagePreviews.set(record.id, previews);
    record.dealImageNames = normalizeFileNames(record.dealImageNames, record.dealImageName)
      .concat(previews.map((item) => item.name))
      .filter((name, index, list) => list.indexOf(name) === index)
      .slice(0, 6);
    record.dealImageName = record.dealImageNames[0] || "";
    record.dealArchiveUpdatedAt = new Date().toISOString();
    saveState();
    renderClosedCustomers();
    renderInstalledPaidCustomers();
    showToast("成交图片已存档");
  }

  function openClosedCustomerRecord(logId) {
    const log = getLog(logId);
    if (!log) {
      showToast("没有找到这条成交记录");
      return;
    }
    const employee = getEmployee(log.employeeId);
    showDetail(
      "已成交客户记录",
      `${employee?.name || "员工"} · ${formatDate(log.timestamp)} ${formatTime(log.timestamp)}`,
      `
        <div class="customer-facts">
          <div><span>客户</span><b>${escapeHtml(log.customer || "未填写")}</b></div>
          <div><span>电话</span><b>${escapeHtml(log.phone || "未留")}</b></div>
          <div><span>位置</span><b>${escapeHtml(displayBuilding(log))} · ${escapeHtml(displayRoom(log))}</b></div>
          <div><span>阶段</span><b>${escapeHtml(normalizeCustomerFollowStage(log.wechatStage))}</b></div>
        </div>
        <article class="simple-card">
          <h3>成交来源</h3>
          <p>${escapeHtml(log.note || "没有填写沟通纪要")}</p>
          <div class="tags">
            <span class="tag">装修：${escapeHtml(log.result || "暂不清楚")}</span>
            <span class="tag">客户类型：${escapeHtml(log.customerType || "A类")}</span>
            <span class="tag">微信：${escapeHtml(displayWechatAdded(log))}</span>
          </div>
        </article>
      `
    );
  }

  function renderAfterSaleDetail(item) {
    const detail = $("#afterSaleDetail");
    if (!detail) return;
    if (!item) {
      detail.innerHTML = `<div class="detail-empty">先选择一个售后客户，再更新安装、尾款和售后问题。</div>`;
      return;
    }

    const { record, sourceLog } = item;
    const display = closedCustomerDisplay(item);
    const afterSaleDraft = normalizeAfterSaleDraft(record.afterSaleDraft);
    const afterSaleValues = afterSaleDraft || record;
    const status = normalizeAfterSaleStatus(afterSaleValues.afterSaleStatus);
    const issueStatus = normalizeAfterSaleIssueStatus(afterSaleValues.afterSaleIssueStatus);
    const updatedAt = record.afterSaleUpdatedAt ? `${formatDate(record.afterSaleUpdatedAt)} ${formatTime(record.afterSaleUpdatedAt)}` : "未更新";
    detail.innerHTML = `
      <article class="after-sale-card after-sale-detail-card lifecycle-info-card">
        <div class="after-sale-card-head">
          <div class="after-sale-customer-block">
            <div class="lifecycle-card-title">
              <strong>客户资料</strong>
            </div>
            <div class="after-sale-customer-brief">
              <strong>${escapeHtml(display.name)}</strong>
              <span>电话：${escapeHtml(display.phone)}</span>
            </div>
          </div>
          <label class="after-sale-status-button">
            <span>安装/尾款备注</span>
            <select data-after-sale-status="${escapeHtml(record.id)}">
              ${afterSaleStatuses.map((item) => `<option value="${escapeHtml(item)}" ${item === status ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="lifecycle-fact-list">
          <div class="lifecycle-fact-row">
            <span>地址</span>
            <b>${escapeHtml([display.building, display.room].filter(Boolean).join(" · "))}</b>
          </div>
          <div class="lifecycle-fact-row lifecycle-fact-row-note">
            <span>提醒</span>
            <b>${escapeHtml(afterSaleAdvice(status))}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>更新时间</span>
            <b>${escapeHtml(updatedAt)}</b>
          </div>
        </div>
        <div class="lifecycle-card-actions">
          <button class="closed-record-button lifecycle-record-button" type="button" data-closed-log="${escapeHtml(sourceLog?.id || "")}" ${sourceLog ? "" : "disabled"}>查看成交记录</button>
        </div>
      </article>

      <article class="after-sale-issue-panel lifecycle-operation-card">
        <div class="deal-archive-head">
          <strong>售后问题</strong>
          <small>单独记录，别和安装尾款备注混在一起</small>
        </div>
        <label class="field">
          <span>问题状态</span>
          <select data-after-sale-issue="${escapeHtml(record.id)}">
            ${afterSaleIssueStatuses.map((item) => `<option value="${escapeHtml(item)}" ${item === issueStatus ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
        <p>${escapeHtml(afterSaleIssueAdvice(issueStatus))}</p>
      </article>
      ${afterSaleDraft ? `<div class="deal-draft-hint">有未提交售后草稿，确认无误后再提交售后信息。</div>` : ""}
      <div class="deal-archive-actions">
        <button class="button secondary" type="button" data-save-after-sale-draft="${escapeHtml(record.id)}">保存草稿</button>
        <button class="button primary after-sale-save" type="button" data-save-after-sale="${escapeHtml(record.id)}">提交售后信息</button>
      </div>
    `;
  }

  function renderAfterSaleCustomers() {
    if (!$("#afterSaleList")) return;
    const query = ($("#afterSaleSearch")?.value || "").trim().toLowerCase();
    const allRecords = afterSaleCustomerRecords();
    const issueFilterValue = "有售后问题";
    const statusGroups = afterSaleStatuses.map((status) => ({
      label: status,
      filter: status,
      items: allRecords.filter((item) => normalizeAfterSaleStatus(item.record.afterSaleStatus) === status)
    })).concat({
      label: issueFilterValue,
      filter: issueFilterValue,
      tone: "warning",
      items: allRecords.filter((item) => hasActiveAfterSaleIssue(item.record))
    });
    $("#afterSaleCount").textContent = allRecords.length ? `${allRecords.length} 个` : "0 个";
    $("#afterSaleSummary").innerHTML = statusGroups.map((group) => {
      const names = group.items.slice(0, 2).map((item) => closedCustomerDisplay(item).name);
      const more = group.items.length > 2 ? `等 ${group.items.length} 个` : "";
      return `
        <button class="after-sale-summary-card ${group.tone === "warning" ? "warning" : ""} ${activeAfterSaleFilter === group.filter ? "active" : ""}" type="button" data-after-sale-filter="${escapeHtml(group.filter)}">
          <div class="after-sale-summary-main">
            <strong>${group.items.length}</strong>
            <span>${escapeHtml(group.label)}</span>
          </div>
          <small>${escapeHtml(names.concat(more ? [more] : []).join("、") || "暂无客户")}</small>
        </button>
      `;
    }).join("");

    $$("[data-after-sale-template]").forEach((button) => {
      button.classList.toggle("active", button.dataset.afterSaleTemplate === afterSaleTemplate);
    });

    const baseRecords = allRecords.filter((item) => {
      if (!activeAfterSaleFilter) return true;
      if (activeAfterSaleFilter === issueFilterValue) return hasActiveAfterSaleIssue(item.record);
      return normalizeAfterSaleStatus(item.record.afterSaleStatus) === activeAfterSaleFilter;
    });
    const templateResult = filterLifecycleCustomerRecords(
      baseRecords,
      query,
      afterSaleTemplate,
      afterSaleFilters,
      "afterSale"
    );
    const filteredRecords = templateResult.records;
    const controls = $("#afterSaleTemplateControls");
    if (controls) controls.innerHTML = templateResult.controls;

    if (!baseRecords.some((item) => item.record.id === activeAfterSaleCustomerId)) {
      activeAfterSaleCustomerId = filteredRecords[0]?.record.id || baseRecords[0]?.record.id || "";
    }
    if (filteredRecords.length && !filteredRecords.some((item) => item.record.id === activeAfterSaleCustomerId)) {
      activeAfterSaleCustomerId = filteredRecords[0].record.id;
    }
    const selectedItem = baseRecords.find((item) => item.record.id === activeAfterSaleCustomerId) || null;

    $("#afterSaleCascadeText").textContent = lifecyclePickerButtonText("afterSale", isLifecyclePickerOpen("afterSale"), allRecords.length);
    $("#afterSaleResultSummary").textContent = allRecords.length
      ? `${templateResult.summaryLabel}，找到 ${filteredRecords.length} 个售后客户${activeAfterSaleFilter ? ` · ${activeAfterSaleFilter}` : ""}`
      : "暂无售后客户";

    if (!allRecords.length) {
      $("#afterSaleList").innerHTML = `
        <div class="detail-empty">还没有售后客户。客户转为已成交后，会自动进入这里备注安装、尾款和售后问题。</div>
      `;
      renderAfterSaleDetail(null);
      return;
    }

    if (!filteredRecords.length) {
      $("#afterSaleList").innerHTML = `<div class="detail-empty">${activeAfterSaleFilter === issueFilterValue ? "当前没有未解决的售后问题。" : activeAfterSaleFilter ? "这个状态下暂时没有匹配客户。" : "没有匹配的售后客户，换姓名、电话、小区或房号再搜。"}</div>`;
      renderAfterSaleDetail(selectedItem);
      return;
    }

    $("#afterSaleList").innerHTML = renderLifecycleCustomerCards(
      filteredRecords,
      activeAfterSaleCustomerId,
      "after-sale-customer",
      "afterSale",
      "没有匹配的售后客户，换姓名、电话、小区或房号再搜。"
    );
    renderAfterSaleDetail(selectedItem);
  }

  function renderInstalledPaidDetail(item) {
    const detail = $("#installedPaidDetail");
    if (!detail) return;
    if (!item) {
      detail.innerHTML = `<div class="detail-empty">先选择一个已安装收尾款客户，再查看安装、收款和成交资料。</div>`;
      return;
    }

    const { record, sourceLog } = item;
    const display = closedCustomerDisplay(item);
    const archivedAt = record.installedPaidAt ? `${formatDate(record.installedPaidAt)} ${formatTime(record.installedPaidAt)}` : "已归档";
    const closedAt = record.closedAt ? `${formatDate(record.closedAt)} ${formatTime(record.closedAt)}` : "未记录";
    const issueStatus = normalizeAfterSaleIssueStatus(record.afterSaleIssueStatus);
    const paidText = record.orderAmount
      ? `${moneyText(amountNumber(record.orderAmount))}${record.depositAmount ? ` / 已收 ${moneyText(amountNumber(record.depositAmount))}` : ""}`
      : "未填写金额";
    detail.innerHTML = `
      <article class="closed-customer-card closed-customer-detail-card lifecycle-info-card installed-paid-card">
        <div class="lifecycle-card-title">
          <strong>最终归档</strong>
        </div>
        <div class="lifecycle-identity">
          <div class="lifecycle-identity-main">
            <strong>${escapeHtml(display.name)}</strong>
            <span>电话：${escapeHtml(display.phone)}</span>
          </div>
          <span class="installed-paid-badge">安装完成 · 尾款收到</span>
        </div>
        <div class="lifecycle-fact-list">
          <div class="lifecycle-fact-row">
            <span>地址</span>
            <b>${escapeHtml([display.building, display.room].filter(Boolean).join(" · "))}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>订单金额</span>
            <b>${escapeHtml(paidText)}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>成交时间</span>
            <b>${escapeHtml(closedAt)}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>归档时间</span>
            <b>${escapeHtml(archivedAt)}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>客户来源</span>
            <b>${escapeHtml(normalizeDealSource(record.dealSource))}</b>
          </div>
          <div class="lifecycle-fact-row">
            <span>售后状态</span>
            <b>${escapeHtml(hasActiveAfterSaleIssue(record) ? "有售后问题，需处理" : "没有售后问题")}</b>
          </div>
        </div>
        <div class="lifecycle-card-actions">
          <button class="closed-record-button lifecycle-record-button" type="button" data-closed-log="${escapeHtml(sourceLog?.id || "")}" ${sourceLog ? "" : "disabled"}>查看成交记录</button>
        </div>
      </article>

      <article class="after-sale-issue-panel lifecycle-operation-card">
        <div class="deal-archive-head">
          <strong>售后问题</strong>
          <small>已收尾款后仍可能有售后，处理完会只保留在归档里</small>
        </div>
        <label class="field">
          <span>问题状态</span>
          <select data-installed-paid-issue="${escapeHtml(record.id)}">
            ${afterSaleIssueStatuses.map((item) => `<option value="${escapeHtml(item)}" ${item === issueStatus ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
        <p>${escapeHtml(afterSaleIssueAdvice(issueStatus))}</p>
        <div class="deal-archive-actions">
          <button class="button primary" type="button" data-save-installed-paid-issue="${escapeHtml(record.id)}">保存售后问题</button>
        </div>
      </article>

      <article class="deal-archive-panel lifecycle-operation-card">
        <div class="deal-archive-head">
          <strong>安装尾款图片</strong>
          <small>合同、收款、安装完成图</small>
        </div>
        <div class="upload-thumb-grid deal-image-grid installed-paid-image-grid">${renderDealImageArchiveReadOnly(record)}</div>
      </article>
    `;
  }

  function renderInstalledPaidCustomers() {
    if (!$("#installedPaidList")) return;
    const query = ($("#installedPaidSearch")?.value || "").trim().toLowerCase();
    const allRecords = installedPaidCustomerRecords();
    const installedPaidGroups = [
      {
        label: "没有售后问题",
        filter: "没有售后问题",
        items: allRecords.filter((item) => !hasActiveAfterSaleIssue(item.record))
      },
      {
        label: "有售后问题",
        filter: "有售后问题",
        tone: "warning",
        items: allRecords.filter((item) => hasActiveAfterSaleIssue(item.record))
      }
    ];
    const summary = $("#installedPaidSummary");
    if (summary) {
      summary.innerHTML = installedPaidGroups.map((group) => {
        const names = group.items.slice(0, 2).map((item) => closedCustomerDisplay(item).name);
        const more = group.items.length > 2 ? `等 ${group.items.length} 个` : "";
        return `
          <button class="after-sale-summary-card ${group.tone === "warning" ? "warning" : ""} ${activeInstalledPaidFilter === group.filter ? "active" : ""}" type="button" data-installed-paid-filter="${escapeHtml(group.filter)}">
            <div class="after-sale-summary-main">
              <strong>${group.items.length}</strong>
              <span>${escapeHtml(group.label)}</span>
            </div>
            <small>${escapeHtml(names.concat(more ? [more] : []).join("、") || "暂无客户")}</small>
          </button>
        `;
      }).join("");
    }
    $$("[data-installed-paid-template]").forEach((button) => {
      button.classList.toggle("active", button.dataset.installedPaidTemplate === installedPaidTemplate);
    });
    const baseRecords = allRecords.filter((item) => {
      if (!activeInstalledPaidFilter) return true;
      if (activeInstalledPaidFilter === "有售后问题") return hasActiveAfterSaleIssue(item.record);
      if (activeInstalledPaidFilter === "没有售后问题") return !hasActiveAfterSaleIssue(item.record);
      return true;
    });
    const templateResult = filterLifecycleCustomerRecords(
      baseRecords,
      query,
      installedPaidTemplate,
      installedPaidFilters,
      "installedPaid"
    );
    const filteredRecords = templateResult.records;
    const controls = $("#installedPaidTemplateControls");
    if (controls) controls.innerHTML = templateResult.controls;

    if (!baseRecords.some((item) => item.record.id === activeInstalledPaidCustomerId)) {
      activeInstalledPaidCustomerId = filteredRecords[0]?.record.id || baseRecords[0]?.record.id || "";
    }
    if (filteredRecords.length && !filteredRecords.some((item) => item.record.id === activeInstalledPaidCustomerId)) {
      activeInstalledPaidCustomerId = filteredRecords[0].record.id;
    }
    const selectedItem = baseRecords.find((item) => item.record.id === activeInstalledPaidCustomerId) || null;

    $("#installedPaidCount").textContent = allRecords.length
      ? `${filteredRecords.length}/${allRecords.length} 个`
      : "0 个";
    $("#installedPaidCascadeText").textContent = lifecyclePickerButtonText("installedPaid", isLifecyclePickerOpen("installedPaid"), allRecords.length);
    $("#installedPaidResultSummary").textContent = allRecords.length
      ? `${templateResult.summaryLabel}，找到 ${filteredRecords.length} 个归档客户${activeInstalledPaidFilter ? ` · ${activeInstalledPaidFilter}` : ""}`
      : "暂无已安装收尾款客户";

    if (!allRecords.length) {
      $("#installedPaidList").innerHTML = `
        <div class="detail-empty">还没有已安装收尾款客户。售后维护提交“已安装，收到尾款”后，会自动转入这里存档。</div>
      `;
      renderInstalledPaidDetail(null);
      return;
    }

    if (!filteredRecords.length) {
      $("#installedPaidList").innerHTML = `<div class="detail-empty">${activeInstalledPaidFilter ? "这个状态下暂时没有匹配客户。" : "没有匹配的归档客户，换姓名、电话、小区或房号再搜。"}</div>`;
      renderInstalledPaidDetail(selectedItem);
      return;
    }

    $("#installedPaidList").innerHTML = renderLifecycleCustomerCards(
      filteredRecords,
      activeInstalledPaidCustomerId,
      "installed-paid-customer",
      "installedPaid",
      "没有匹配的归档客户，换姓名、电话、小区或房号再搜。"
    );
    renderInstalledPaidDetail(selectedItem);
  }

  function readAfterSaleFields(recordId, record) {
    const draft = normalizeAfterSaleDraft(record.afterSaleDraft) || {};
    const select = $(`[data-after-sale-status="${CSS.escape(recordId)}"]`);
    const issueSelect = $(`[data-after-sale-issue="${CSS.escape(recordId)}"]`);
    return {
      afterSaleStatus: normalizeAfterSaleStatus(select?.value || draft.afterSaleStatus || record.afterSaleStatus),
      afterSaleIssueStatus: normalizeAfterSaleIssueStatus(issueSelect?.value || draft.afterSaleIssueStatus || record.afterSaleIssueStatus)
    };
  }

  function saveAfterSaleDraft(recordId) {
    const record = state.closedCustomers.find((item) => item.id === recordId);
    if (!record) {
      showToast("没有找到这个售后客户");
      return;
    }
    record.afterSaleDraft = readAfterSaleFields(recordId, record);
    record.afterSaleDraftUpdatedAt = new Date().toISOString();
    saveState();
    renderAfterSaleCustomers();
    showToast("售后草稿已保存");
  }

  function saveAfterSaleStatus(recordId) {
    const record = state.closedCustomers.find((item) => item.id === recordId);
    if (!record) {
      showToast("没有找到这个售后客户");
      return;
    }
    const nextValues = readAfterSaleFields(recordId, record);
    const oldStatus = normalizeAfterSaleStatus(record.afterSaleStatus);
    const oldIssueStatus = normalizeAfterSaleIssueStatus(record.afterSaleIssueStatus);
    record.afterSaleStatus = nextValues.afterSaleStatus;
    record.afterSaleIssueStatus = nextValues.afterSaleIssueStatus;
    record.afterSaleUpdatedAt = new Date().toISOString();
    if (record.afterSaleStatus === installedPaidStatus) {
      record.installedPaidAt = record.afterSaleUpdatedAt;
      activeInstalledPaidCustomerId = record.id;
      if (!hasActiveAfterSaleIssue(record)) activeAfterSaleCustomerId = "";
    } else {
      delete record.installedPaidAt;
    }
    delete record.afterSaleDraft;
    delete record.afterSaleDraftUpdatedAt;
    if (oldStatus !== record.afterSaleStatus) {
      appendChangeLog(record, "安装/尾款备注", oldStatus, record.afterSaleStatus);
    }
    if (oldIssueStatus !== record.afterSaleIssueStatus) {
      appendChangeLog(record, "售后问题", oldIssueStatus, record.afterSaleIssueStatus);
    }
    saveState();
    renderAfterSaleCustomers();
    renderInstalledPaidCustomers();
    renderClosedCustomers();
    renderChangeLogs();
    showToast(record.afterSaleStatus === installedPaidStatus
      ? (hasActiveAfterSaleIssue(record) ? "已归档，同时保留在售后维护处理问题" : "已归档到“已安装收尾款”")
      : "售后信息已保存");
  }

  function saveInstalledPaidIssueStatus(recordId) {
    const record = state.closedCustomers.find((item) => item.id === recordId);
    if (!record) {
      showToast("没有找到这个归档客户");
      return;
    }
    const select = $(`[data-installed-paid-issue="${CSS.escape(recordId)}"]`);
    const nextIssueStatus = normalizeAfterSaleIssueStatus(select?.value || record.afterSaleIssueStatus);
    const oldIssueStatus = normalizeAfterSaleIssueStatus(record.afterSaleIssueStatus);
    if (oldIssueStatus === nextIssueStatus) {
      showToast("售后问题状态没有变化");
      return;
    }
    record.afterSaleIssueStatus = nextIssueStatus;
    record.afterSaleUpdatedAt = new Date().toISOString();
    appendChangeLog(record, "售后问题", oldIssueStatus, nextIssueStatus);
    saveState();
    renderAfterSaleCustomers();
    renderInstalledPaidCustomers();
    renderClosedCustomers();
    renderChangeLogs();
    showToast(hasActiveAfterSaleIssue(record) ? "已同步到售后维护处理" : "售后问题已处理，保留在归档");
  }

  function lifecyclePickerButtonText(type, open, count = 0) {
    if (type === "installedPaid") {
      if (!count) return "暂无归档客户";
      return open ? "收起查找归档客户" : "查找已安装收尾款客户";
    }
    if (!count) return type === "afterSale" ? "暂无售后客户" : "暂无成交客户";
    if (open) return type === "afterSale" ? "收起查找售后客户" : "收起查找成交客户";
    return type === "afterSale" ? "查找 / 更换售后客户" : "查找 / 更换成交客户";
  }

  function syncLifecyclePickerButtonText(type) {
    const target = type === "installedPaid" ? $("#installedPaidCascadeText") : type === "afterSale" ? $("#afterSaleCascadeText") : $("#closedCustomerCascadeText");
    if (!target) return;
    const count = type === "installedPaid"
      ? installedPaidCustomerRecords().length
      : type === "afterSale"
        ? afterSaleCustomerRecords().length
        : closedCustomerRecords().length;
    target.textContent = lifecyclePickerButtonText(type, isLifecyclePickerOpen(type), count);
  }

  function setLifecyclePickerOpen(type, open) {
    const config = type === "installedPaid"
      ? {
          section: "#installedPaidSection",
          menu: "#installedPaidCascadeMenu",
          button: "#installedPaidCascadeButton"
        }
      : type === "afterSale"
      ? {
          section: "#afterSaleSection",
          menu: "#afterSaleCascadeMenu",
          button: "#afterSaleCascadeButton"
        }
      : {
          section: "#closedCustomerSection",
          menu: "#closedCustomerCascadeMenu",
          button: "#closedCustomerCascadeButton"
        };
    $(config.menu)?.classList.toggle("is-hidden", !open);
    $(config.button)?.setAttribute("aria-expanded", String(open));
    $(config.section)?.classList.toggle("is-picking", open);
    syncLifecyclePickerButtonText(type);
  }

  function isLifecyclePickerOpen(type) {
    const menu = type === "installedPaid" ? $("#installedPaidCascadeMenu") : type === "afterSale" ? $("#afterSaleCascadeMenu") : $("#closedCustomerCascadeMenu");
    return !!menu && !menu.classList.contains("is-hidden");
  }

  function customerRecordByKey(key) {
    const employeeId = currentEmployeeId();
    return customerRecords(employeeId).find((record) => record.key === key);
  }

  function startReturnVisitFromCustomer(key) {
    const record = customerRecordByKey(key);
    if (!record) return;
    if (record.closedCustomer) {
      showToast("该客户已成交，不需要登记回访");
      return;
    }
    setContactType("customer", record.latest.customerType || "D类", "", { refreshReturnPicker: false });
    setVisitMode("return", {
      selectedId: record.latest.id,
      applyFirst: false
    });
    beginOldCustomerReturn(record.latest.id);
    switchView("field");
  }

  function requestInvalidCustomer(key) {
    const record = customerRecordByKey(key);
    if (!record || record.invalidRequest?.status === "pending") return;
    state.invalidRequests.unshift({
      id: `invalid-${Date.now()}`,
      customerKey: key,
      employeeId: record.latest.employeeId,
      customer: record.latest.customer,
      phone: record.latest.phone || "",
      building: displayBuilding(record.latest),
      room: displayRoom(record.latest),
      reason: "员工标记：客户已买别家家具",
      status: "pending",
      createdAt: new Date().toISOString()
    });
    saveState();
    renderCustomerTracker();
    renderWarnings();
    renderMetrics();
    showToast("已提交老板审核，通过后转为无效客户");
  }

  function reviewInvalidCustomer(requestId, status) {
    const request = state.invalidRequests.find((item) => item.id === requestId);
    if (!request) return;
    request.status = status;
    request.reviewedAt = new Date().toISOString();
    saveState();
    renderWarnings();
    renderMetrics();
    renderCustomerTracker();
    showToast(status === "approved" ? "已通过无效客户申请" : "已驳回无效客户申请");
  }

  function reviewOrderChangeRequest(requestId, status) {
    const request = state.orderChangeRequests.find((item) => item.id === requestId);
    if (!request) return;
    const record = state.closedCustomers.find((item) => item.id === request.recordId);
    request.status = status;
    request.reviewedAt = new Date().toISOString();
    if (record && status === "approved") {
      const oldValue = normalizeOrderChangeStatus(record.orderChangeStatus);
      record.orderChangeStatus = normalizeOrderChangeStatus(request.requestedStatus);
      record.dealArchiveUpdatedAt = new Date().toISOString();
      if (record.dealArchiveDraft) {
        record.dealArchiveDraft.orderChangeStatus = record.orderChangeStatus;
      }
      appendChangeLog(record, "是否改单", oldValue, record.orderChangeStatus, getEmployee(request.employeeId));
    }
    if (record && record.dealArchiveDraft && normalizeOrderChangeStatus(record.dealArchiveDraft.orderChangeStatus) === normalizeOrderChangeStatus(request.requestedStatus)) {
      record.dealArchiveDraft.orderChangeStatus = normalizeOrderChangeStatus(record.orderChangeStatus);
    }
    saveState();
    renderWarnings();
    renderMetrics();
    renderClosedCustomers();
    renderInstalledPaidCustomers();
    renderChangeLogs();
    showToast(status === "approved" ? "已通过改单申请" : "已驳回改单申请");
  }

  function closeCustomerFromLog(log, options = {}) {
    const { confirm = true, toast = true } = options;
    if (!log || !isCustomerContactLog(log)) return false;
    const key = customerRecordKey(log);
    const existingClosedCustomer = closedCustomerForKey(key) || closedCustomerForIdentity(log);
    if (existingClosedCustomer) {
      activeClosedCustomerId = existingClosedCustomer.id;
      if (toast) showToast("该客户已是成交客户");
      renderOldCustomerOptions();
      renderClosedCustomers();
      renderInstalledPaidCustomers();
      return false;
    }
    if (confirm && !window.confirm(`确认把“${log.customer}”转为已成交客户？\n\n转为已成交后，不会删除原始记录，但这个客户不会再出现在老客户回访选择里。`)) {
      return false;
    }

    log.wechatStage = "已成交";
    log.customerType = "A类";

    const closedRecord = {
      id: `closed-${Date.now()}`,
      customerKey: key,
      employeeId: log.employeeId,
      customer: log.customer,
      phone: log.phone || "",
      building: displayBuilding(log),
      room: displayRoom(log),
      sourceLogId: log.id,
      result: log.result || "",
      wechatName: log.wechatName || "",
      customerFollowStage: "已成交",
      storeReceptionStatus: "已到过店",
      budgetStatus: "已做过预算",
      note: log.note || "",
      closedAt: new Date().toISOString(),
      afterSaleStatus: notInstalledStatus,
      afterSaleIssueStatus: "无售后问题",
      afterSaleUpdatedAt: new Date().toISOString(),
      dealImageNames: [],
      orderAmount: "",
      depositAmount: "",
      salesShareRatio: "10%",
      commissionPoints: "1点",
      orderChangeStatus: "没有改单",
      dealSource: "空白客户",
      status: "closed"
    };
    state.closedCustomers.unshift(closedRecord);
    activeClosedCustomerId = closedRecord.id;
    state.drafts = state.drafts.filter((draft) => {
      if (rawDraftVisitMode(draft) !== "return" || (draft.contactType || "customer") !== "customer") return true;
      const sourceLog = draft.oldCustomerLogId ? getLog(draft.oldCustomerLogId) : null;
      const draftMatches = customerRecordKey(sourceLog || draft) === key
        || customerRecordKey(draft) === key
        || Boolean(customerIdentityMatchReason(log, sourceLog || draft))
        || Boolean(customerIdentityMatchReason(log, draft));
      if (draftMatches && draft.id === activeDraftId) activeDraftId = "";
      return !draftMatches;
    });

    if ($("#oldCustomerSelect")?.value === log.id) {
      $("#oldCustomerSelect").value = "";
      oldCustomerCascade = { property: "", building: "", customerId: "" };
      setFormEditMode(false, "该客户已转为已成交，不再进入回访名单。", "success");
    }
    renderOldCustomerOptions();
    renderClosedCustomers();
    renderAfterSaleCustomers();
    renderInstalledPaidCustomers();
    renderCustomerTracker();
    renderEmployees();
    setOldCustomerStatus(`已转为已成交客户：${log.customer}`, "success");
    if (toast) showToast("已转为已成交客户");
    return true;
  }

  function markOldCustomerClosed(logId) {
    const log = getLog(logId);
    if (closeCustomerFromLog(log, { confirm: true, toast: true })) {
      saveState();
    }
  }

  function renderEmployeeOptions() {
    renderEmployees();
    renderDraftStatus();
  }

  function setSelectValue(selector, value) {
    const element = $(selector);
    if (!element || value === undefined || value === null) return;
    const hasOption = Array.from(element.options).some((option) => option.value === value);
    if (hasOption) element.value = value;
  }

  function contactTypeUsesPriority(type = currentContactType()) {
    return (type || "customer") === "customer";
  }

  function selectedOldCustomerLog() {
    const id = $("#oldCustomerSelect")?.value || "";
    return id ? getLog(id) : null;
  }

  function shouldLockCustomerTypeToA() {
    if (!contactTypeUsesPriority()) return false;
    if (isStoreVisitMode()) return true;
    if (shouldForceCustomerTypeA($("#wechatStageInput")?.value)) return true;
    const selectedLog = selectedOldCustomerLog();
    if (isReturnVisitMode() && selectedLog?.customerType === "A类") return true;
    const draft = activeDraft();
    return Boolean(isReturnVisitMode() && draft?.customerType === "A类");
  }

  function syncCustomerTypeLock() {
    const select = $("#customerTypeSelect");
    if (!select) return;
    const usesPriority = contactTypeUsesPriority();
    const locked = usesPriority && shouldLockCustomerTypeToA();
    Array.from(select.options).forEach((option) => {
      option.disabled = locked && option.value !== "A类";
    });
    if (locked && Array.from(select.options).some((option) => option.value === "A类")) {
      select.value = "A类";
    }
    select.dataset.lockedToA = locked ? "true" : "false";
    select.title = locked ? "客户阶段已升为A类，不能再降级" : "";
  }

  function syncChannelIndustryInput() {
    const field = $("#channelIndustryCustomField");
    const input = $("#channelIndustryCustomInput");
    const select = $("#customerTypeSelect");
    if (!field || !input || !select) return;
    const isCustom = currentContactType() === "channel" && select.value === channelIndustryCustomValue;
    field.classList.toggle("is-hidden", !isCustom);
    input.disabled = !isCustom;
    input.required = isCustom;
    if (!isCustom) input.value = "";
  }

  function setContactCategoryValue(type, value) {
    const select = $("#customerTypeSelect");
    if (!select) return;

    if (type !== "channel") {
      setSelectValue("#customerTypeSelect", value);
      return;
    }

    const industry = normalizeChannelIndustry(value);
    const customInput = $("#channelIndustryCustomInput");
    if (!industry) {
      select.value = "";
      if (customInput) customInput.value = "";
    } else if (channelIndustryOptions.includes(industry)) {
      select.value = industry;
      if (customInput) customInput.value = "";
    } else {
      select.value = channelIndustryCustomValue;
      if (customInput) customInput.value = industry;
    }
    syncChannelIndustryInput();
  }

  function contactConfig(type) {
    const configs = {
      customer: {
        title: "客户信息",
        name: "客户姓名",
        phone: "客户电话",
        type: "客户类型",
        wechat: "客户微信昵称",
        namePlaceholder: "例如：张经理",
        wechatPlaceholder: "例如：王女士软装咨询",
        options: ["A类", "B类", "C类", "D类"]
      },
      master: {
        title: "师傅",
        name: "师傅姓名",
        phone: "师傅电话",
        type: "师傅工种",
        level: "师傅等级",
        wechat: "师傅微信昵称",
        namePlaceholder: "例如：李师傅",
        wechatPlaceholder: "例如：李师傅木工",
        options: ["木工", "油漆工", "水电工", "瓦工", "安装师傅", "工长", "设计师", "其他师傅"]
      },
      channel: {
        title: "异业和渠道",
        name: "联系人/渠道名",
        phone: "联系电话",
        type: "所属行业",
        level: "渠道等级",
        wechat: "渠道微信昵称",
        namePlaceholder: "例如：某某设计师",
        wechatPlaceholder: "例如：设计师王姐",
        options: channelIndustryOptions
      }
    };
    return configs[type] || configs.customer;
  }

  function currentContactType() {
    return $("[data-contact-type].active")?.dataset.contactType || "customer";
  }

  function syncCollapsibleSection(bodyId) {
    const body = $(`#${bodyId}`);
    const button = $(`[data-section-toggle="${bodyId}"]`);
    if (!body || !button) return;
    const collapsed = Boolean(collapsibleSectionState[bodyId]);
    body.classList.toggle("is-hidden", collapsed);
    button.setAttribute("aria-expanded", String(!collapsed));
    button.querySelector("span").textContent = collapsed ? "展开" : "收起";
    button.querySelector("i").textContent = collapsed ? "⌄" : "⌃";
    body.closest(".form-section")?.classList.toggle("is-collapsed", collapsed);
  }

  function syncAllCollapsibleSections() {
    Object.keys(collapsibleSectionState).forEach(syncCollapsibleSection);
  }

  function expandVisibleEmployeeSections() {
    Object.keys(collapsibleSectionState).forEach((bodyId) => {
      const body = $(`#${bodyId}`);
      const section = body?.closest(".form-section");
      if (section && !section.classList.contains("is-hidden")) {
        collapsibleSectionState[bodyId] = false;
      }
    });
    syncAllCollapsibleSections();
  }

  function setSectionInputsDisabled(sectionSelector, disabled) {
    const section = $(sectionSelector);
    if (!section) return;
    section.querySelectorAll("input, select, textarea, button").forEach((element) => {
      if (element.closest(".form-section-head")) return;
      element.disabled = disabled;
    });
  }

  function syncConditionalFieldStates() {
    const isCustomer = currentContactType() === "customer";
    const isStore = isStoreVisitMode();
    const storeCustomerInfo = !isStore || storeNeedsCustomerInfo();
    const storePropertyInfo = !isStore || storeNeedsPropertyInfo();
    const propertyHidden = $("#propertyInfoSection")?.classList.contains("is-hidden") || !isCustomer || !storePropertyInfo;
    const customerHidden = $("#customerInfoSection")?.classList.contains("is-hidden") || (isStore && !storeCustomerInfo);
    const siteHidden = $("#siteSituationSection")?.classList.contains("is-hidden");
    const proofHidden = $("#proofInfoSection")?.classList.contains("is-hidden");

    if (formEditMode) {
      setSectionInputsDisabled("#propertyInfoSection", propertyHidden);
      setSectionInputsDisabled("#customerInfoSection", customerHidden);
      setSectionInputsDisabled("#siteSituationSection", siteHidden);
      setSectionInputsDisabled("#proofInfoSection", proofHidden);
    }

    $("#customerInput").required = !customerHidden && (!isStore || currentStoreResult() === "已成交");
    $("#phoneInput").required = false;
    $("#buildingSelect").required = !propertyHidden && !isStore;
    $("#roomSelect").required = !propertyHidden && !isStore;
    $("#resultSelect").required = !siteHidden;
    syncCustomPropertyInput();
    syncCustomResultInput();
    syncAllScrollPickers();
  }

  function syncFormLayoutByMode() {
    const isCustomer = currentContactType() === "customer";
    const isReturn = isReturnVisitMode();
    const isStore = isStoreVisitMode();
    const isClosed = isClosedVisitMode();
    const isAfterSale = isAfterSaleVisitMode();
    const isInstalledPaid = isInstalledPaidVisitMode();
    const isLifecycleView = isClosed || isAfterSale || isInstalledPaid;
    if (isStore) syncStoreReceptionLayout({ clearHidden: false });
    $("#closedCustomerSection")?.classList.toggle("is-hidden", !isClosed);
    $("#afterSaleSection")?.classList.toggle("is-hidden", !isAfterSale);
    $("#installedPaidSection")?.classList.toggle("is-hidden", !isInstalledPaid);
    $("#storeReceptionSection")?.classList.toggle("is-hidden", !isStore || isLifecycleView);
    $(".contact-type-top")?.classList.toggle("is-hidden", isStore || isLifecycleView);
    $("#siteSituationSection")?.classList.toggle("is-hidden", isLifecycleView || isStore || !isCustomer);
    $("#proofInfoSection")?.classList.toggle("is-hidden", isLifecycleView || isStore);
    $("#contactLevelSection")?.classList.toggle("is-hidden", isCustomer);
    $("#customerFollowStageField")?.classList.toggle("is-hidden", !isReturn);
    $("#propertyInfoSection")?.classList.toggle("is-hidden", isLifecycleView || isReturn || !isCustomer || (isStore && !storeNeedsPropertyInfo()));
    $("#customerInfoSection")?.classList.toggle("is-hidden", isLifecycleView || (isStore && !storeNeedsCustomerInfo()));
    $("#customerRoomField")?.classList.toggle("is-hidden", !isCustomer);
    $("#contactDetailGrid")?.classList.toggle("resource-mode", !isCustomer);
    syncAllCollapsibleSections();
    syncConditionalFieldStates();
  }

  function setContactType(type, selectedValue = "", levelValue = "", options = {}) {
    if (isStoreVisitMode() && type !== "customer") {
      type = "customer";
      selectedValue = selectedValue || "A类";
    }
    const previousType = currentContactType();
    const config = contactConfig(type);
    $$("[data-contact-type]").forEach((button) => {
      button.classList.toggle("active", button.dataset.contactType === type);
    });
    if (previousType !== type) {
      oldResourceFilters = { query: "", type: "", level: "" };
    }
    $("#contactSectionTitle").textContent = config.title;
    $("#contactNameLabel").textContent = config.name;
    $("#contactPhoneLabel").textContent = config.phone;
    $("#contactTypeLabel").textContent = config.type;
    $("#wechatNameLabel").textContent = config.wechat;
    $("#customerInput").placeholder = config.namePlaceholder;
    $("#wechatNameInput").placeholder = config.wechatPlaceholder;
    $("#customerTypeSelect").innerHTML = [
      type === "channel" ? '<option value="">请选择所属行业</option>' : "",
      ...config.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`),
      type === "channel" ? `<option value="${channelIndustryCustomValue}">其他（手动填写）</option>` : ""
    ].join("");
    const defaultTypeValue = type === "channel" ? "" : config.options[0];
    setContactCategoryValue(type, selectedValue || defaultTypeValue);
    $("#contactLevelLabel").textContent = config.level || "等级";
    const currentLevel = $("#contactLevelSelect").value;
    $("#contactLevelSelect").value = contactLevels.includes(levelValue)
      ? levelValue
      : (contactLevels.includes(currentLevel) ? currentLevel : contactLevels[3]);
    syncFormLayoutByMode();
    syncChannelIndustryInput();
    syncCustomerTypeLock();

    if (options.refreshReturnPicker !== false && isReturnVisitMode()) {
      oldCustomerCascade = { property: "", building: "", customerId: "" };
      renderOldCustomerOptions();
      const selectedOldCustomerId = $("#oldCustomerSelect")?.value;
      if (selectedOldCustomerId) applyOldCustomer(selectedOldCustomerId);
    }
    renderEmployeeDraftTray();
  }

  function currentWindowScrollPosition() {
    return {
      left: window.scrollX,
      top: window.scrollY
    };
  }

  function restoreWindowScroll(position) {
    if (!position) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          left: position.left,
          top: position.top,
          behavior: "auto"
        });
      });
    });
  }

  function restoreDraftOpenAnchor(draftId, anchorTop, fallbackScrollPosition, listScrollTop) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const list = $(".draft-quick-list");
        if (list && Number.isFinite(listScrollTop)) {
          list.scrollTop = listScrollTop;
        }
        const target = $$(".open-draft").find((button) => button.dataset.draft === draftId);
        if (target && Number.isFinite(anchorTop)) {
          const nextTop = target.getBoundingClientRect().top;
          const delta = nextTop - anchorTop;
          if (delta > 0) {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const missingRoom = window.scrollY + delta - maxScroll;
            if (missingRoom > 0) {
              const currentRoom = parseFloat(getComputedStyle($("#logForm")).paddingBottom) || 0;
              setDraftOpenScrollRoom(currentRoom + missingRoom + 16);
            }
          }
          window.scrollBy({
            left: 0,
            top: delta,
            behavior: "auto"
          });
          return;
        }
        restoreWindowScroll(fallbackScrollPosition);
      });
    });
  }

  function setDraftOpenScrollRoom(height = 0) {
    $("#logForm")?.style.setProperty("--draft-open-scroll-room", `${Math.max(0, Math.ceil(height))}px`);
  }

  function switchContactType(type) {
    const previousType = currentContactType();
    const nextType = isStoreVisitMode() ? "customer" : type;
    if (!nextType || nextType === previousType) return;
    const scrollPosition = currentWindowScrollPosition();

    const mode = currentVisitMode();
    const shouldSaveBeforeSwitch = ["new", "return"].includes(mode)
      && formEditMode
      && (Boolean(activeDraft()) || hasMeaningfulFormInput());

    if (!shouldSaveBeforeSwitch) {
      setContactType(nextType);
      restoreWindowScroll(scrollPosition);
      return;
    }

    saveCurrentDraft({ silent: true, force: true });
    activeDraftId = "";
    resetFormForBlankEntry(
      `已保存${contactTypeLabel(previousType)}草稿。现在可查看${contactTypeLabel(nextType)}草稿，或点“新登记”继续填写。`,
      {
        editing: false,
        level: "success",
        mode,
        contactType: nextType,
        preserveScroll: true,
        scrollPosition
      }
    );
    showToast(`已保存${contactTypeLabel(previousType)}草稿`);
  }

  function setWechatAvatarStatus(message, level = "", detail = "") {
    const status = $("#wechatAvatarStatus");
    if (!status) return;
    status.innerHTML = detail
      ? `<strong>${escapeHtml(message)}</strong><small>${escapeHtml(detail)}</small>`
      : escapeHtml(message);
    status.title = detail || "";
    status.classList.toggle("success", level === "success");
    status.classList.toggle("warn", level === "warn");
  }

  function fileKey(file) {
    return `${file.name}|${file.size}|${file.lastModified}`;
  }

  function setNativeFileList(input, files) {
    if (!input) return;
    if (!files.length) {
      input.value = "";
      return;
    }
    if (typeof DataTransfer === "undefined") return;
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
  }

  function mergeUploadFiles(existing, incoming, multiple) {
    if (!multiple) return incoming.slice(-1);
    const next = [];
    const seen = new Set();
    [...existing, ...incoming].forEach((file) => {
      const key = fileKey(file);
      if (seen.has(key)) return;
      seen.add(key);
      next.push(file);
    });
    return next;
  }

  function revokeUploadPreviewUrls(inputId) {
    const urls = uploadPreviewUrls.get(inputId) || [];
    urls.forEach((url) => URL.revokeObjectURL(url));
    uploadPreviewUrls.set(inputId, []);
  }

  function uploadFiles(inputId) {
    return uploadFilesCache.get(inputId) || [];
  }

  function renderUploadPreview(inputId) {
    const config = uploadPreviewConfig[inputId];
    const preview = config ? $(`#${config.previewId}`) : null;
    if (!config || !preview) return;

    revokeUploadPreviewUrls(inputId);
    const files = uploadFiles(inputId);
    const rememberedNames = files.length ? [] : (rememberedUploadNames[inputId] || []);
    const urls = [];
    const currentCount = files.length || rememberedNames.length;
    const canAdd = files.length ? files.length < config.max : true;
    const compactRemembered = Boolean(rememberedNames.length && config.max === 1);
    const addText = rememberedNames.length && !files.length ? "重新上传" : (files.length ? config.addMoreText : config.addText);
    const addSubText = config.max > 1 ? `${currentCount}/${config.max}` : "";

    const addTile = canAdd && !compactRemembered ? `
      <button class="upload-add-tile" type="button" data-upload-trigger="${inputId}">
        <svg><use href="#icon-camera"></use></svg>
        <span>${escapeHtml(addText)}</span>
        ${addSubText ? `<small>${escapeHtml(addSubText)}</small>` : ""}
      </button>
    ` : "";

    const fileTiles = files.map((file, index) => {
      const url = URL.createObjectURL(file);
      urls.push(url);
      return `
        <article class="upload-thumb" title="${escapeHtml(file.name)}">
          <img src="${url}" alt="${escapeHtml(config.label)}${index + 1}" />
          <button class="upload-remove" type="button" data-upload-remove="${inputId}" data-upload-index="${index}" aria-label="删除${escapeHtml(config.label)}${index + 1}">×</button>
          <span class="upload-thumb-label">${escapeHtml(config.label)}${index + 1}</span>
        </article>
      `;
    }).join("");

    const rememberedTiles = rememberedNames.map((name, index) => `
      <article class="upload-thumb is-placeholder ${compactRemembered ? "is-compact-record" : ""}" title="${escapeHtml(name)}">
        <span class="upload-thumb-label">${escapeHtml(config.rememberedLabel)}${rememberedNames.length > 1 ? index + 1 : ""}</span>
        ${compactRemembered ? `<button class="upload-replace-button" type="button" data-upload-trigger="${inputId}">重新上传</button>` : ""}
      </article>
    `).join("");

    uploadPreviewUrls.set(inputId, urls);
    preview.innerHTML = `${fileTiles}${rememberedTiles}${addTile}`;
    syncFormEditModeControls();
  }

  function renderAllUploadPreviews(remembered = {}) {
    Object.keys(uploadPreviewConfig).forEach((inputId) => {
      uploadFilesCache.set(inputId, []);
      const input = $(`#${inputId}`);
      if (input) input.value = "";
    });
    rememberedUploadNames.photoInput = Array.isArray(remembered.photoNames) ? remembered.photoNames.filter(Boolean) : [];
    rememberedUploadNames.wechatInput = normalizeFileNames(remembered.wechatFileNames, remembered.wechatFileName);
    rememberedUploadNames.wechatAvatarInput = remembered.wechatAvatarFileName ? [remembered.wechatAvatarFileName] : [];
    const homepageInput = $("#wechatAvatarInput");
    if (homepageInput) {
      if (remembered.wechatHomepageFingerprint) {
        homepageInput.dataset.homepageFingerprint = remembered.wechatHomepageFingerprint;
      } else {
        delete homepageInput.dataset.homepageFingerprint;
      }
      delete homepageInput.dataset.homepageFingerprintPending;
    }
    Object.keys(uploadPreviewConfig).forEach(renderUploadPreview);
    syncWechatAddedByProof(remembered);
    syncWechatNameRequirement(remembered);
  }

  function setRememberedUpload(inputId, names = []) {
    rememberedUploadNames[inputId] = names.filter(Boolean);
    if (!uploadFiles(inputId).length) renderUploadPreview(inputId);
  }

  function clearWechatHomepageFingerprint() {
    wechatHomepageFingerprintRunId += 1;
    const input = $("#wechatAvatarInput");
    if (!input) return;
    delete input.dataset.homepageFingerprint;
    delete input.dataset.homepageFingerprintPending;
  }

  async function captureWechatHomepageFingerprint(file) {
    if (!file?.arrayBuffer || !window.crypto?.subtle) return "";
    const bytes = await file.arrayBuffer();
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function refreshWechatHomepageFingerprint() {
    const input = $("#wechatAvatarInput");
    const file = input?.files?.[0];
    if (!input || !file) {
      clearWechatHomepageFingerprint();
      return "";
    }

    const runId = wechatHomepageFingerprintRunId + 1;
    wechatHomepageFingerprintRunId = runId;
    delete input.dataset.homepageFingerprint;
    input.dataset.homepageFingerprintPending = "true";
    try {
      const fingerprint = await captureWechatHomepageFingerprint(file);
      if (runId !== wechatHomepageFingerprintRunId || input.files?.[0] !== file) return "";
      if (fingerprint) input.dataset.homepageFingerprint = fingerprint;
      return fingerprint;
    } catch (error) {
      console.warn("微信主页截图指纹生成失败", error);
      return "";
    } finally {
      if (runId === wechatHomepageFingerprintRunId) {
        delete input.dataset.homepageFingerprintPending;
        refreshIdentityCheckFromForm();
        scheduleAutosave();
      }
    }
  }

  function clearAvatarRecognitionIfAutoFilled() {
    const input = $("#wechatNameInput");
    if (!input) return;
    if (["头像截图识别", "头像截图文件名"].includes(input.dataset.source)) {
      input.value = "";
      delete input.dataset.source;
    }
  }

  function hasWechatScreenshot(existingDraft = {}) {
    const wechatFiles = Array.from($("#wechatInput")?.files || []);
    const wechatAvatarFile = $("#wechatAvatarInput")?.files?.[0];
    const existingWechatFileNames = normalizeFileNames(existingDraft.wechatFileNames, existingDraft.wechatFileName);
    return Boolean(
      wechatFiles.length
      || wechatAvatarFile
      || existingWechatFileNames.length
      || existingDraft.wechatAvatarFileName
      || rememberedUploadNames.wechatInput?.length
      || rememberedUploadNames.wechatAvatarInput?.length
    );
  }

  function syncWechatAddedByProof(existingDraft = {}) {
    const select = $("#wechatAddedSelect");
    if (!select) return false;
    if (hasWechatScreenshot(existingDraft)) {
      select.value = "有";
      return true;
    }
    return false;
  }

  function syncWechatNameRequirement(existingDraft = {}) {
    const input = $("#wechatNameInput");
    if (!input) return;
    const required = $("#wechatAddedSelect")?.value === "有" || hasWechatScreenshot(existingDraft);
    input.required = false;
    input.toggleAttribute("data-wechat-required", required);
    input.setAttribute("aria-required", String(required));
  }

  function handleUploadInputChange(inputId) {
    const config = uploadPreviewConfig[inputId];
    const input = config ? $(`#${inputId}`) : null;
    if (!config || !input) return;
    if (!formEditMode) {
      input.value = "";
      promptStartFormEdit();
      return;
    }

    const incoming = Array.from(input.files || []);
    const previous = uploadFiles(inputId);
    let files = mergeUploadFiles(previous, incoming, config.multiple);
    if (files.length > config.max) {
      files = files.slice(0, config.max);
      showToast(`${config.label}最多上传 ${config.max} 张`);
    }

    rememberedUploadNames[inputId] = [];
    uploadFilesCache.set(inputId, files);
    setNativeFileList(input, files);
    renderUploadPreview(inputId);

    if (["wechatInput", "wechatAvatarInput"].includes(inputId) && files.length) {
      syncWechatAddedByProof();
      syncWechatNameRequirement();
    }
    if (inputId === "wechatAvatarInput") {
      clearWechatHomepageFingerprint();
      void refreshWechatHomepageFingerprint();
      handleWechatAvatarUpload();
    }
    if (inputId === "wechatInput" && files.length) {
      if (!$("#wechatStageInput").value) $("#wechatStageInput").value = "没有到过店";
    }
    refreshIdentityCheckFromForm();
  }

  function removeUploadFile(inputId, index) {
    if (!formEditMode) {
      promptStartFormEdit();
      return;
    }
    const input = $(`#${inputId}`);
    const files = uploadFiles(inputId).filter((_, itemIndex) => itemIndex !== index);
    uploadFilesCache.set(inputId, files);
    setNativeFileList(input, files);
    renderUploadPreview(inputId);

    if (inputId === "wechatAvatarInput" && !files.length) {
      avatarRecognitionRunId += 1;
      clearWechatHomepageFingerprint();
      setWechatAvatarStatus("未上传");
      clearAvatarRecognitionIfAutoFilled();
    }
    syncWechatNameRequirement();
    scheduleAutosave();
    refreshIdentityCheckFromForm();
  }

  function cleanWechatNickname(value) {
    return String(value || "")
      .replace(/\.(png|jpe?g|webp|gif|bmp)$/i, "")
      .replace(/微信头像截图|微信头像|头像截图|微信截图|客户微信|微信昵称|昵称|头像|截图|聊天记录|聊天|profile/gi, "")
      .replace(/[_\-—=+()[\]{}【】<>《》|]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[:：,，.。;；\s]+|[:：,，.。;；\s]+$/g, "")
      .trim();
  }

  function validWechatNickname(value) {
    const text = cleanWechatNickname(value);
    if (!text || text.length > 24) return "";
    if (/^(img|image|screenshot|wx|mmexport|wechat|photo|scan|ocr|file|\d{4,})$/i.test(text)) return "";
    if (/^[a-f0-9]{8,}$/i.test(text) || /^[a-z0-9]{10,}$/i.test(text)) return "";
    if (/^(微信|微信号|地区|性别|昵称|头像|朋友圈|发消息|添加到通讯录|备注和标签|更多信息|投诉)$/.test(text)) return "";
    if (/^1\d{10}$/.test(text)) return "";
    return text;
  }

  function withTimeout(promise, ms, message) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(message)), ms);
      promise.then((value) => {
        clearTimeout(timer);
        resolve(value);
      }).catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  function extractWechatNicknameFromText(text, fileName = "") {
    const normalized = String(text || "")
      .replace(/\r/g, "\n")
      .replace(/[|｜]/g, "\n")
      .replace(/[ \t]{2,}/g, "\n");
    const patterns = [
      /(?:微信昵称|昵称|备注名|名字)[:：\s]*([^\n]{1,24})/i,
      /([^\n]{1,24})\s*(?:微信号|地区|备注和标签|朋友圈|发消息)/i
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      const candidate = validWechatNickname(match?.[1]);
      if (candidate) return candidate;
    }

    const lines = normalized
      .split(/\n+/)
      .map((line) => validWechatNickname(line))
      .filter(Boolean)
      .filter((line) => !/(微信号|地区|性别|个性签名|更多信息|二维码|添加|发消息|投诉|保存|识别)/.test(line));
    return lines[0] || validWechatNickname(fileName);
  }

  function summarizeOcrText(text) {
    const summary = String(text || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4)
      .join(" / ");
    return summary.length > 80 ? `${summary.slice(0, 80)}...` : summary;
  }

  function nicknameFromWechatAvatarFallback(fileName = "", useCustomerName = false) {
    const fromFile = validWechatNickname(fileName);
    if (fromFile) return fromFile;
    if (!useCustomerName) return "";
    const customerName = $("#customerInput").value.trim();
    return customerName ? `${customerName}微信` : "";
  }

  function loadOcrEngine() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (ocrEnginePromise) return ocrEnginePromise;

    ocrEnginePromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timer = setTimeout(() => {
        script.remove();
        reject(new Error("OCR 加载超时"));
      }, 9000);

      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      script.onload = () => {
        clearTimeout(timer);
        window.Tesseract ? resolve(window.Tesseract) : reject(new Error("OCR 未加载成功"));
      };
      script.onerror = () => {
        clearTimeout(timer);
        reject(new Error("OCR 加载失败"));
      };
      document.head.appendChild(script);
    });

    return ocrEnginePromise;
  }

  async function recognizeWechatAvatarNickname(file, runId) {
    const tesseract = await loadOcrEngine();
    const result = await tesseract.recognize(file, "chi_sim+eng", {
      logger: (progress) => {
        if (progress.status === "recognizing text" && runId === avatarRecognitionRunId) {
          const percent = Math.round((progress.progress || 0) * 100);
          setWechatAvatarStatus(`识别中 ${percent}%`, "", "进度完成后，还要提取昵称并写入输入框");
        }
      }
    });
    const rawText = result?.data?.text || "";
    return {
      nickname: extractWechatNicknameFromText(rawText, file.name),
      rawText: summarizeOcrText(rawText)
    };
  }

  async function handleWechatAvatarUpload() {
    const file = $("#wechatAvatarInput").files[0];
    if (!file) {
      avatarRecognitionRunId += 1;
      setWechatAvatarStatus("未上传");
      return;
    }

    const runId = avatarRecognitionRunId + 1;
    avatarRecognitionRunId = runId;
    const nameInput = $("#wechatNameInput");
    const startedName = nameInput.value.trim();
    $("#wechatAddedSelect").value = "有";
    syncWechatNameRequirement();
    setWechatAvatarStatus("识别中", "", "正在识别微信主页截图中的昵称，请稍等");
    showToast("正在识别微信主页截图中的昵称");

    let nickname = "";
    let usedFallback = false;
    let rawText = "";
    let failReason = "";
    try {
      const recognized = await withTimeout(recognizeWechatAvatarNickname(file, runId), 8000, "识别超时，可能是网络慢或截图里没有清晰昵称文字");
      if (runId !== avatarRecognitionRunId) return;
      nickname = recognized.nickname;
      rawText = recognized.rawText;
    } catch (error) {
      if (runId !== avatarRecognitionRunId) return;
      ocrEnginePromise = null;
      failReason = error.message || "OCR 识别失败";
      console.warn("微信头像昵称识别失败", error);
    }

    if (!nickname) {
      nickname = nicknameFromWechatAvatarFallback(file.name, !startedName);
      usedFallback = true;
    }

    if (nickname) {
      const currentName = nameInput.value.trim();
      const currentSource = nameInput.dataset.source || "";
      const changedByUser = currentName
        && currentName !== startedName
        && !["头像截图识别", "头像截图文件名"].includes(currentSource);
      if (changedByUser) {
        setWechatAvatarStatus(
          "已识别，未覆盖",
          "warn",
          `识别到：${nickname}。当前昵称已被手动改成：${currentName}`
        );
        showToast("已识别昵称，因员工已手动修改未覆盖");
        return;
      }

      nameInput.value = nickname;
      nameInput.dataset.source = usedFallback ? "头像截图文件名" : "头像截图识别";
      const unchanged = startedName && startedName === nickname;
      setWechatAvatarStatus(
        unchanged ? "昵称已确认" : (usedFallback ? "已填入昵称" : "识别成功"),
        usedFallback ? "warn" : "success",
        usedFallback
          ? `已填入：${nickname}。${failReason || "未从截图文字里提取到昵称，员工可手动修改。"}`
          : ""
      );
      scheduleAutosave();
      showToast(unchanged ? "昵称已确认" : (usedFallback ? "已根据现有信息填入微信昵称" : "已自动识别微信昵称"));
      return;
    }

    const currentName = nameInput.value.trim();
    setWechatAvatarStatus(
      currentName ? "未识别到，已保留" : "未识别到，可手填",
      "warn",
      `${currentName ? `当前昵称：${currentName}。` : ""}${failReason || "截图里没有清晰昵称文字"}`
    );
    showToast("未识别到微信昵称，可手动填写");
  }

  function activeDraft() {
    return activeDraftId ? getDraft(activeDraftId) : null;
  }

  function readFormPayload(existingDraft = {}) {
    existingDraft = existingDraft || {};
    const isStoreVisit = isStoreVisitMode();
    const photoFiles = isStoreVisit ? [] : Array.from($("#photoInput").files);
    const wechatFiles = isStoreVisit ? [] : Array.from($("#wechatInput").files);
    const wechatAvatarFile = $("#wechatAvatarInput").files[0];
    const storeResult = isStoreVisit ? normalizeStoreVisitResult($("#storeResultSelect")?.value) : "";
    const storeContactStatus = isStoreVisit ? currentStoreContactStatus() : "";
    const storeAnonymous = isStoreVisit && storeResult !== "已成交" && storeContactStatus !== "已留资料";
    const selectedBuilding = currentPropertyValue();
    const selectedBuildingNumber = $("#buildingNumberSelect").value;
    const selectedUnit = $("#unitSelect").value;
    const selectedRoom = $("#roomSelect").value;
    const selectedFloor = extractFloor(selectedRoom) || "1";
    const contactType = isStoreVisit ? "customer" : currentContactType();
    const isCustomerContact = contactType === "customer";
    const shouldSaveProperty = isCustomerContact && (!isStoreVisit || storeNeedsPropertyInfo());
    const buildingUnitValue = formatBuildingUnit(selectedBuildingNumber, selectedUnit);
    const locationValue = shouldSaveProperty
      ? [buildingUnitValue, selectedRoom].filter(Boolean).join(" ")
      : "";
    const receptionValue = isCustomerContact && !isStoreVisit ? $("#receptionSelect").value : "";
    const receptionOther = $("#receptionOtherInput").value.trim();
    const finalReception = isStoreVisit ? "门店接待" : (isCustomerContact && receptionValue === "其他情况" && receptionOther ? receptionOther : receptionValue);
    const photoNames = isStoreVisit ? [] : (photoFiles.length ? photoFiles.map((file) => file.name) : (existingDraft.photoNames || []));
    const existingWechatFileNames = isStoreVisit ? [] : normalizeFileNames(existingDraft.wechatFileNames, existingDraft.wechatFileName);
    const wechatFileNames = wechatFiles.length ? wechatFiles.map((file) => file.name) : existingWechatFileNames;
    const wechatFileName = wechatFileNames[0] || "";
    const rememberedWechatAvatarFileName = rememberedUploadNames.wechatAvatarInput?.[0] || "";
    const wechatAvatarFileName = wechatAvatarFile
      ? wechatAvatarFile.name
      : (existingDraft.wechatAvatarFileName || rememberedWechatAvatarFileName);
    const wechatHomepageFingerprint = wechatAvatarFile
      ? ($("#wechatAvatarInput")?.dataset.homepageFingerprint || existingDraft.wechatHomepageFingerprint || "")
      : (existingDraft.wechatHomepageFingerprint || $("#wechatAvatarInput")?.dataset.homepageFingerprint || "");
    const rawCustomerName = $("#customerInput").value.trim();
    const wechatName = $("#wechatNameInput").value.trim();
    let wechatStage = isStoreVisit
      ? storeVisitResultStage(storeResult)
      : (isReturnVisitMode() ? normalizeCustomerFollowStage($("#wechatStageInput").value) : "没有到过店");
    const wechatNameSource = $("#wechatNameInput").dataset.source || existingDraft.wechatNameSource || "";
    const wechatAdded = $("#wechatAddedSelect").value === "有" || wechatFileNames.length || wechatAvatarFileName || wechatName ? "有" : "没有";
    const selectedCustomerType = currentContactCategoryValue(contactType);
    const shouldUseAType = isStoreVisit || (contactTypeUsesPriority(contactType) && (shouldForceCustomerTypeA(wechatStage) || shouldLockCustomerTypeToA()));
    const finalCustomerType = shouldUseAType ? "A类" : selectedCustomerType;

    return {
      visitType: currentVisitModeLabel(),
      oldCustomerLogId: isReturnVisitMode() ? $("#oldCustomerSelect").value : "",
      contactType,
      employeeId: currentEmployeeId(),
      storeResult,
      storeContactStatus,
      storeAnonymous,
      property: shouldSaveProperty ? selectedBuilding : "",
      buildingNumber: shouldSaveProperty ? selectedBuildingNumber : "",
      unit: shouldSaveProperty ? selectedUnit : "",
      building: shouldSaveProperty ? [selectedBuilding, buildingUnitValue].filter(Boolean).join(" ") : "",
      room: shouldSaveProperty ? selectedRoom : "",
      floor: shouldSaveProperty ? selectedFloor : "",
      customer: storeAnonymous ? storeAnonymousLabel(storeResult) : rawCustomerName,
      phone: storeAnonymous ? "" : $("#phoneInput").value.trim(),
      reception: finalReception,
      receptionOther: isCustomerContact && !isStoreVisit ? receptionOther : "",
      result: isStoreVisit ? "暂不清楚" : (isCustomerContact ? (currentRenovationResultValue() || "暂不清楚") : "暂不清楚"),
      customerType: finalCustomerType,
      contactLevel: isCustomerContact ? "" : ($("#contactLevelSelect").value || contactLevels[3]),
      wechatAdded: storeAnonymous ? "没有" : wechatAdded,
      location: locationValue,
      locationSource: shouldSaveProperty ? "楼栋房号自动生成" : (isStoreVisit ? "门店接待，未填写楼盘房号" : "师傅/异业资源，无需楼盘房号"),
      photos: isStoreVisit ? 0 : (photoFiles.length ? photoFiles.length : Number(existingDraft.photos || 0)),
      photoNames,
      duration: isCustomerContact ? (isStoreVisit || finalReception === "没有开门" ? 0 : Number($("#durationInput").value)) : 0,
      durationSource: isStoreVisit ? "门店接待，无需现场停留" : (isCustomerContact ? "员工下拉选择" : "师傅/异业等级记录，无需填写现场停留"),
      wechatFileName,
      wechatFileNames,
      wechatAvatarFileName: storeAnonymous ? "" : wechatAvatarFileName,
      wechatHomepageFingerprint: storeAnonymous ? "" : wechatHomepageFingerprint,
      wechatName: storeAnonymous ? "" : wechatName,
      wechatNameSource: storeAnonymous ? "" : wechatNameSource,
      wechatStage,
      note: isStoreVisit ? storeAnonymousLabel(storeResult) : $("#noteInput").value.trim()
    };
  }

  function syncDurationWithReception() {
    const durationInput = $("#durationInput");
    if ($("#receptionSelect").value === "没有开门") {
      durationInput.value = "0";
      return;
    }
    if (durationInput.value === "0") {
      durationInput.value = "5";
    }
  }

  function validateWechatNicknameBeforeSubmit(payload) {
    if (payload.wechatAdded !== "有" || payload.wechatName) return true;
    const label = $("#wechatNameLabel")?.textContent || "微信昵称";
    $("#wechatAddedSelect").value = "有";
    syncWechatNameRequirement(activeDraft() || {});
    collapsibleSectionState.customerInfoBody = false;
    syncCollapsibleSection("customerInfoBody");
    setWechatAvatarStatus("需要填写昵称", "warn", `已添加微信或上传截图，提交前必须填写${label}`);
    setDraftStatusHint(`请先填写${label}，再提交拜访日志。`, "warn");
    $("#wechatNameInput").focus();
    showToast(`请填写${label}后再提交`);
    return false;
  }

  function hasReliableContact(payload) {
    if (storeAllowsAnonymous(payload)) return true;
    return Boolean(usablePhoneKey(payload.phone) || hasWechatHomepageEvidence(payload));
  }

  function findIdentityMatch(payload, options = {}) {
    if (storeAllowsAnonymous(payload)) return null;
    const contactType = payload.contactType || "customer";
    const excludeIds = new Set([payload.id, payload.oldCustomerLogId, options.excludeLogId].filter(Boolean));
    const records = state.logs
      .filter((log) => log.employeeId === payload.employeeId)
      .filter((log) => !excludeIds.has(log.id) && !excludeIds.has(log.oldCustomerLogId) && !excludeIds.has(primaryRecordForLog(log)?.id));

    if (contactType === "customer") {
      const addressKey = customerAddressKey(payload);
      const addressMatch = addressKey
        ? records.find((log) => isCustomerContactLog(primaryRecordForLog(log)) && customerAddressKey(primaryRecordForLog(log)) === addressKey)
        : null;
      if (addressMatch) {
        const matchLog = primaryRecordForLog(addressMatch);
        return {
          level: "info",
          mode: "auto",
          reason: "房号相同",
          log: matchLog,
          title: "这户以前登记过",
          text: "本次提交会归到原客户档案，只增加一条新的跟进记录。"
        };
      }

      const contactMatch = records.find((log) => {
        const matchLog = primaryRecordForLog(log);
        if (!isCustomerContactLog(matchLog)) return false;
        const reason = customerIdentityMatchReason(payload, matchLog);
        return ["电话相同", "微信主页相同"].includes(reason);
      });
      if (contactMatch) {
        const matchLog = primaryRecordForLog(contactMatch);
        const reason = customerIdentityMatchReason(payload, matchLog);
        return {
          level: "warn",
          mode: "block",
          reason,
          log: matchLog,
          title: `${reason}，请先核对`,
          text: `这个联系方式已在“${matchLog.customer || "老客户"} · ${displayBuilding(matchLog)} · ${displayRoom(matchLog)}”里出现。可能是同一客户，也可能是电话填错。`
        };
      }
      return null;
    }

    const resourceMatch = records.find((log) => resourceIdentityMatchReason(payload, primaryRecordForLog(log)));
    if (resourceMatch) {
      const matchLog = primaryRecordForLog(resourceMatch);
      const reason = resourceIdentityMatchReason(payload, matchLog);
      return {
        level: "info",
        mode: "auto",
        reason,
        log: matchLog,
        title: `已有这位${contactTypeLabel(contactType)}`,
        text: `本次提交会更新原资料，不会在${contactTypeLabel(contactType)}列表里新增重复卡片。`
      };
    }
    return null;
  }

  function renderIdentityCheckPanel(check = null) {
    const panel = $("#identityCheckPanel");
    if (!panel) return;
    if (!check) {
      panel.classList.add("is-hidden");
      panel.classList.remove("warn", "info");
      panel.innerHTML = "";
      return;
    }
    const log = check.log;
    const meta = log
      ? [log.phone || log.wechatName || "未留联系方式", displayBuilding(log), displayRoom(log)].filter(Boolean).join(" · ")
      : "";
    const actionHtml = check.mode === "block"
      ? `
        <div class="identity-check-actions">
          <button class="button primary" type="button" data-identity-action="use-existing" data-log-id="${escapeHtml(log.id)}">就是原资料</button>
          <button class="button secondary" type="button" data-identity-action="edit-contact">号码填错了</button>
          <button class="button draft" type="button" data-identity-action="save-draft">先存草稿</button>
        </div>
      `
      : (log ? `<button class="identity-check-link" type="button" data-identity-action="use-existing" data-log-id="${escapeHtml(log.id)}">关联原资料</button>` : "");
    panel.classList.remove("is-hidden", "warn", "info");
    panel.classList.add(check.level === "warn" ? "warn" : "info");
    panel.innerHTML = `
      <div class="identity-check-copy">
        <strong>${escapeHtml(check.title)}</strong>
        <span>${escapeHtml(check.text)}</span>
        ${meta ? `<small>${escapeHtml(meta)}</small>` : ""}
      </div>
      ${actionHtml}
    `;
  }

  function refreshIdentityCheckFromForm() {
    if (!formEditMode || isClosedVisitMode() || isAfterSaleVisitMode() || isInstalledPaidVisitMode()) {
      renderIdentityCheckPanel(null);
      return null;
    }
    const payload = readFormPayload(activeDraft() || {});
    const check = findIdentityMatch(payload);
    renderIdentityCheckPanel(check);
    return check;
  }

  function linkCurrentFormToExistingRecord(logId) {
    const log = getLog(logId);
    if (!log) return;
    const scrollPosition = currentWindowScrollPosition();
    const type = log.contactType || "customer";

    setContactType(type, currentContactCategoryValue(type), $("#contactLevelSelect")?.value || "", {
      refreshReturnPicker: false
    });
    setVisitMode("return", {
      selectedId: log.id,
      applyFirst: false,
      keepEditing: true
    });
    renderOldCustomerOptions(log.id);
    $("#oldCustomerSelect").value = log.id;
    oldCustomerCascade.customerId = log.id;
    setOldCustomerStatus(`已关联原资料：${log.customer || contactTypeLabel(type)}。本次提交会更新原资料。`, "success");
    setFormEditMode(true, "已关联原资料，保留当前填写内容继续补充。提交后只增加一条跟进记录。", "success");
    formHasUserChanges = true;
    renderIdentityCheckPanel(null);
    scheduleAutosave();
    restoreWindowScroll(scrollPosition);
    showToast("已关联原资料，可继续填写");
  }

  function validateContactMethodBeforeSubmit(payload) {
    if (hasReliableContact(payload)) return true;
    const typeLabel = contactTypeLabel(payload.contactType);
    renderIdentityCheckPanel({
      level: "warn",
      mode: "notice",
      title: `${typeLabel}缺少联系方式`,
      text: "请至少填写一个有效电话，或上传微信主账号页面截图。只有手写姓名/备注不能正式提交。"
    });
    setDraftStatusHint("请填写电话，或上传微信主账号页面截图后再提交。", "warn");
    collapsibleSectionState.customerInfoBody = false;
    syncCollapsibleSection("customerInfoBody");
    $("#phoneInput")?.focus();
    showToast("请先留电话或上传微信主页截图");
    return false;
  }

  function validateIdentityBeforeSubmit(payload) {
    if ($("#wechatAvatarInput")?.files?.[0] && $("#wechatAvatarInput")?.dataset.homepageFingerprintPending === "true") {
      renderIdentityCheckPanel({
        level: "info",
        mode: "notice",
        title: "正在确认微信主页截图",
        text: "请稍等几秒，系统确认完成后会自动检查是否与旧资料重复。"
      });
      setDraftStatusHint("正在确认微信主页截图，请稍等后再提交。", "saving");
      showToast("正在确认微信主页截图");
      return false;
    }
    const check = findIdentityMatch(payload);
    renderIdentityCheckPanel(check);
    if (!check) return true;
    if (check.mode === "auto" && check.log) {
      payload.oldCustomerLogId = payload.oldCustomerLogId || check.log.id;
      setDraftStatusHint(`${check.title}，本次会自动归到原资料。`, "success");
      return true;
    }
    setDraftStatusHint("发现重复联系方式，请先核对后再提交。", "warn");
    showToast("发现重复联系方式，请先核对");
    return false;
  }

  function setDraftStatusHint(message = "", level = "") {
    draftStatusHint = message;
    draftStatusLevel = level;
    renderDraftStatus();
  }

  function clearDraftStatusHint() {
    draftStatusHint = "";
    draftStatusLevel = "";
  }

  function currentLockMessage() {
    if (isInstalledPaidVisitMode()) return INSTALLED_PAID_LOCK_MESSAGE;
    if (isAfterSaleVisitMode()) return AFTER_SALE_LOCK_MESSAGE;
    if (isClosedVisitMode()) return CLOSED_LOCK_MESSAGE;
    if (isStoreVisitMode()) return STORE_LOCK_MESSAGE;
    return isReturnVisitMode() ? RETURN_LOCK_MESSAGE : FORM_LOCK_MESSAGE;
  }

  function currentLockTitle() {
    if (isInstalledPaidVisitMode()) return "已安装收尾款";
    if (isAfterSaleVisitMode()) return "售后维护";
    if (isClosedVisitMode()) return "已成交客户";
    return isReturnVisitMode() ? "选择老客户回访" : "未开始登记";
  }

  function syncFormEditGate() {
    const gate = $("#formEditGate");
    if (!gate) return;
    const title = gate.querySelector("strong");
    const text = gate.querySelector("span");
    if (title) title.textContent = currentLockTitle();
    if (text) text.textContent = currentLockMessage();
  }

  function unlockVisitModeButtons() {
    $$(".visit-mode button").forEach((button) => {
      button.disabled = false;
      button.removeAttribute("disabled");
      button.setAttribute("aria-disabled", "false");
    });
  }

  function isFormLockExempt(element) {
    if (!element?.closest) return false;
    if (element.closest("#closedCustomerSection")) return true;
    if (element.closest("#afterSaleSection")) return true;
    if (element.closest("#installedPaidSection")) return true;
    if (element.closest("#newEntry") || element.closest("#employeeDraftTray")) return true;
    if (element.closest(".contact-type-switch") && ["new", "return"].includes(currentVisitMode())) return true;
    if (!isReturnVisitMode()) return false;
    return Boolean(element.closest("#oldCustomerSection"));
  }

  function syncFormEditModeControls() {
    const form = $("#logForm");
    if (!form) return;
    const returnPicking = !formEditMode && isReturnVisitMode();
    const storeMode = isStoreVisitMode();
    const closedMode = isClosedVisitMode();
    const afterSaleMode = isAfterSaleVisitMode();
    const installedPaidMode = isInstalledPaidVisitMode();
    form.classList.toggle("is-locked", !formEditMode);
    form.classList.toggle("is-return-picking", returnPicking);
    form.classList.toggle("is-return-mode", isReturnVisitMode());
    form.classList.toggle("is-store-mode", storeMode);
    form.classList.toggle("is-closed-mode", closedMode);
    form.classList.toggle("is-after-sale-mode", afterSaleMode);
    form.classList.toggle("is-installed-paid-mode", installedPaidMode);
    $("#formEditGate")?.classList.toggle("is-hidden", formEditMode || closedMode || afterSaleMode || installedPaidMode);
    syncFormEditGate();
    form.querySelectorAll("input, select, textarea, button").forEach((element) => {
      element.disabled = !formEditMode && !isFormLockExempt(element);
    });
    unlockVisitModeButtons();
    syncCustomerTypeLock();
    syncConditionalFieldStates();
  }

  function setFormEditMode(enabled, message = "", level = "warn") {
    formEditMode = Boolean(enabled);
    if (!formEditMode) {
      clearTimeout(autosaveTimer);
      formHasUserChanges = false;
    }
    syncFormEditModeControls();
    if (message) {
      setDraftStatusHint(message, formEditMode ? "" : level);
      return;
    }
    renderDraftStatus();
  }

  function promptStartFormEdit() {
    setFormEditMode(false, currentLockMessage(), "warn");
    showToast(isInstalledPaidVisitMode() ? "已安装收尾款只做归档检索" : isAfterSaleVisitMode() ? "售后维护只更新状态" : isClosedVisitMode() ? "已成交客户区只查看，不用填写" : isReturnVisitMode() ? "请先选择老客户再填写" : isStoreVisitMode() ? "请先点“新登记”填写门店客户" : "请先点“新登记”再填写");
  }

  function hasMeaningfulFormInput() {
    const payload = readFormPayload(activeDraft() || {});
    return Boolean(
      payload.oldCustomerLogId
      || payload.customer
      || payload.phone
      || payload.note
      || payload.wechatName
      || (payload.wechatStage && payload.wechatStage !== "没有到过店")
      || payload.wechatFileName
      || (payload.wechatFileNames && payload.wechatFileNames.length)
      || payload.wechatAvatarFileName
      || (payload.photoNames && payload.photoNames.length)
      || formTouchedAddress
    );
  }

  function draftTitle(draft) {
    const type = draft.contactType || "customer";
    const name = draft.customer || "未填写姓名";
    const shortType = {
      customer: "客户",
      master: "师傅",
      channel: "异业"
    };
    return `${shortType[type] || contactTypeLabel(type)} · ${name}`;
  }

  function draftMeta(draft) {
    const type = draft.contactType || "customer";
    if (type === "customer") {
      return [displayBuilding(draft), displayRoom(draft)].filter(Boolean).join(" · ");
    }
    return [
      draft.customerType || contactTypeLabel(type),
      draft.contactLevel || "未选等级"
    ].filter(Boolean).join(" · ");
  }

  function renderEmployeeDraftTray() {
    const tray = $("#employeeDraftTray");
    if (!tray) return;
    if (isClosedVisitMode() || isAfterSaleVisitMode() || isInstalledPaidVisitMode()) {
      tray.classList.add("is-hidden");
      tray.innerHTML = "";
      syncFormEditModeControls();
      return;
    }
    if (compactReturnDraftsForState(activeDraftId)) {
      saveState();
    }
    const drafts = draftsForCurrentVisitMode(currentEmployeeId());
    if (!drafts.length) {
      tray.classList.add("is-hidden");
      tray.innerHTML = "";
      syncFormEditModeControls();
      return;
    }

    tray.classList.remove("is-hidden");
    const hasNotice = Boolean(draftTrayNotice);
    tray.innerHTML = `
      ${hasNotice ? `<div class="draft-submit-note">${escapeHtml(draftTrayNotice)}</div>` : ""}
      <div class="draft-quick-list">
        ${drafts.map((draft) => {
          const canDeleteDraft = draftVisitMode(draft) !== "return";
          return `
          <article class="draft-quick-card ${draft.id === activeDraftId ? "active" : ""} ${canDeleteDraft ? "" : "no-delete"}">
            <button class="draft-quick-open open-draft" type="button" data-draft="${escapeHtml(draft.id)}">
              <span class="draft-quick-main">
                <b>${escapeHtml(draftTitle(draft))}</b>
                <small>${escapeHtml(draftMeta(draft))}</small>
              </span>
              <span class="draft-quick-action">
                <strong>${draft.id === activeDraftId ? "当前正在编辑" : "继续编辑"}</strong>
                <small>${formatTime(draft.updatedAt || draft.createdAt || new Date())}</small>
              </span>
            </button>
            ${canDeleteDraft ? `<button class="draft-delete-button" type="button" data-delete-draft="${escapeHtml(draft.id)}" aria-label="删除${escapeHtml(draftTitle(draft))}">删除</button>` : ""}
          </article>
        `;
        }).join("")}
      </div>
    `;
    syncFormEditModeControls();
  }

  function renderDraftStatus() {
    const status = $("#draftStatus");
    if (!status) return;
    status.classList.toggle("success", draftStatusLevel === "success");
    status.classList.toggle("saving", draftStatusLevel === "saving");
    status.classList.toggle("warn", draftStatusLevel === "warn");
    if (isInstalledPaidVisitMode()) {
      status.textContent = INSTALLED_PAID_LOCK_MESSAGE;
      status.classList.add("success");
      return;
    }
    if (isAfterSaleVisitMode()) {
      status.textContent = AFTER_SALE_LOCK_MESSAGE;
      status.classList.add("success");
      return;
    }
    if (isClosedVisitMode()) {
      status.textContent = CLOSED_LOCK_MESSAGE;
      status.classList.add("success");
      return;
    }
    if (draftStatusHint) {
      status.textContent = draftStatusHint;
      return;
    }

    if (!formEditMode) {
      status.textContent = currentLockMessage();
      status.classList.add("warn");
      return;
    }

    const draft = activeDraft();
    if (draft) {
      status.textContent = `正在修改草稿：${draft.customer || displayRoom(draft)}，上次保存 ${formatTime(draft.updatedAt || draft.createdAt || new Date())}。正式提交后不能再修改。`;
      return;
    }

    const employeeDraft = draftsForCurrentVisitMode(currentEmployeeId())[0];
    if (employeeDraft) {
      status.textContent = `你有${currentDraftScopeLabel()}草稿：${employeeDraft.customer || displayRoom(employeeDraft)}，可在下方继续修改。`;
      return;
    }

    status.textContent = "填写后会自动保存草稿，正式提交后不能再修改。";
  }

  function saveCurrentDraft(options = {}) {
    const { silent = false, force = true } = options;
    if (isInstalledPaidVisitMode()) {
      if (!silent) showToast("已安装收尾款是最终存档，不需要保存草稿");
      return null;
    }
    if (isAfterSaleVisitMode()) {
      if (!silent) showToast("请点售后信息卡片里的“保存草稿”");
      return null;
    }
    if (isClosedVisitMode()) {
      if (!silent) showToast("请点成交档案卡片里的“保存草稿”");
      return null;
    }
    if (!formEditMode) {
      if (!silent) promptStartFormEdit();
      return null;
    }
    if (!force && !hasMeaningfulFormInput() && !activeDraft()) return null;
    const scrollPosition = currentWindowScrollPosition();
    draftTrayNotice = "";
    const now = new Date().toISOString();
    let draft = activeDraft();
    const payload = readFormPayload(draft || {});
    if (!draft) {
      draft = findMatchingReturnDraft(payload);
    }
    let savedDraft = draft;

    if (draft) {
      Object.assign(draft, payload, { createdAt: draft.createdAt || now, updatedAt: now, status: "draft" });
      activeDraftId = draft.id;
    } else {
      const newDraft = {
        id: `draft-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        status: "draft",
        ...payload
      };
      state.drafts.unshift(newDraft);
      activeDraftId = newDraft.id;
      savedDraft = newDraft;
    }
    compactReturnDraftsForState(savedDraft.id);

    saveState();
    renderEmployees();
    formHasUserChanges = false;
    if (silent) {
      setDraftStatusHint(`已自动保存 ${formatTime(now)}，可以继续填写。`, "success");
    } else {
      setDraftStatusHint(`草稿已保存 ${formatTime(now)}，下方“未提交草稿”可继续编辑。`, "success");
      showToast("草稿已保存，可继续修改");
    }
    restoreWindowScroll(scrollPosition);
    return savedDraft;
  }

  function autosaveCurrentDraft() {
    autosaveTimer = null;
    if (!formEditMode) return;
    if (suppressAutosave || (!formHasUserChanges && !activeDraft())) return;
    if (!hasMeaningfulFormInput() && !activeDraft()) {
      clearDraftStatusHint();
      renderDraftStatus();
      return;
    }

    try {
      setDraftStatusHint("正在自动保存...", "saving");
      saveCurrentDraft({ silent: true, force: false });
    } catch (error) {
      console.warn("自动保存失败", error);
      setDraftStatusHint("自动保存失败，请点保存草稿", "warn");
    }
  }

  function scheduleAutosave(event) {
    if (isInstalledPaidVisitMode()) return;
    if (isAfterSaleVisitMode()) return;
    if (isClosedVisitMode()) return;
    if (!formEditMode) return;
    if (suppressAutosave) return;
    const target = event?.target;
    if (target && (target.closest("#oldCustomerCascadeMenu") || String(target.id || "").startsWith("oldResource"))) {
      return;
    }
    if (event?.target?.id && ["buildingSelect", "buildingNumberSelect", "unitSelect", "roomSelect"].includes(event.target.id)) {
      formTouchedAddress = true;
    }
    formHasUserChanges = true;
    if (!draftStatusHint || draftStatusLevel === "success") {
      setDraftStatusHint("正在填写，稍后自动保存...", "saving");
    }
    refreshIdentityCheckFromForm();
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(autosaveCurrentDraft, 1500);
  }

  function loadDraftToForm(draftId, options = {}) {
    const draft = getDraft(draftId);
    if (!draft) return;
    if (draft.employeeId && draft.employeeId !== currentEmployeeId()) {
      showToast("只能打开当前账号自己的草稿");
      return;
    }
    const scrollPosition = options.scrollPosition || currentWindowScrollPosition();
    const anchorTop = options.anchorTop;
    const listScrollTop = options.listScrollTop;
    const previousScrollHeight = document.documentElement.scrollHeight;
    if (activeDraftId !== draft.id && hasMeaningfulFormInput()) {
      saveCurrentDraft({ silent: true, force: true });
    }
    draftTrayNotice = "";
    activeDraftId = draft.id;
    clearTimeout(autosaveTimer);
    clearDraftStatusHint();
    formHasUserChanges = false;
    formTouchedAddress = false;
    setContactType(draft.contactType || "customer", draft.customerType, draft.contactLevel);
    setVisitMode(rawDraftVisitMode(draft), {
      selectedId: draft.oldCustomerLogId || "",
      applyFirst: false
    });
    setPropertyValue(draft.property);
    renderBuildingNumberOptions();
    setSelectValue("#buildingNumberSelect", draft.buildingNumber);
    renderUnitOptions();
    setSelectValue("#unitSelect", draft.unit);
    renderRoomOptions();
    setSelectValue("#roomSelect", draft.room);
    $("#customerInput").value = draft.customer || "";
    $("#phoneInput").value = draft.phone || "";
    setSelectValue("#receptionSelect", ["没有开门", "有师傅", "有业主", "师傅和业主都在", "其他情况"].includes(draft.reception) ? draft.reception : "其他情况");
    $("#receptionOtherInput").value = draft.receptionOther || (draft.reception === "其他情况" ? "" : "");
    if (!["没有开门", "有师傅", "有业主", "师傅和业主都在", "其他情况"].includes(draft.reception)) {
      $("#receptionOtherInput").value = draft.reception || "";
    }
    setRenovationResultValue(draft.result);
    setContactCategoryValue(draft.contactType || "customer", draft.customerType);
    setSelectValue("#contactLevelSelect", draft.contactLevel || contactLevels[3]);
    setSelectValue("#wechatAddedSelect", draft.wechatAdded || "没有");
    setSelectValue("#durationInput", String(draft.duration ?? 5));
    syncDurationWithReception();
    $("#wechatNameInput").value = draft.wechatName || "";
    $("#wechatNameInput").dataset.source = draft.wechatNameSource || "";
    setWechatAvatarStatus(
      draft.wechatAvatarFileName ? "已记录主页截图" : "未上传",
      draft.wechatAvatarFileName ? "success" : "",
      draft.wechatAvatarFileName ? "草稿主页截图已带出，可重新上传更新昵称" : ""
    );
    setSelectValue("#storeResultSelect", normalizeStoreVisitResult(draft.storeResult || storeVisitResultFromStage(draft.wechatStage)));
    setSelectValue("#storeContactSelect", draft.storeContactStatus || (draft.storeAnonymous ? "未留资料" : "已留资料"));
    syncStoreReceptionLayout({ clearHidden: false });
    setSelectValue("#wechatStageInput", normalizeCustomerFollowStage(draft.wechatStage));
    $("#noteInput").value = draft.note || "";
    renderAllUploadPreviews({
      photoNames: draft.photoNames || [],
      wechatFileName: draft.wechatFileName || "",
      wechatFileNames: draft.wechatFileNames || [],
      wechatAvatarFileName: draft.wechatAvatarFileName || "",
      wechatHomepageFingerprint: draft.wechatHomepageFingerprint || ""
    });
    renderEmployees();
    setFormEditMode(true);
    syncCustomerTypeLock();
    syncOldResourceFiltersFromForm({ keepSelection: true, render: true, selectedId: draft.oldCustomerLogId || "" });
    switchView("field");
    setDraftOpenScrollRoom(0);
    setDraftOpenScrollRoom(previousScrollHeight - document.documentElement.scrollHeight + 16);
    restoreDraftOpenAnchor(draft.id, anchorTop, scrollPosition, listScrollTop);
    refreshIdentityCheckFromForm();
    showToast("草稿已打开，可继续修改");
  }

  function resetFormForBlankEntry(statusMessage = FORM_LOCK_MESSAGE, options = {}) {
    const editing = options.editing === undefined ? formEditMode : Boolean(options.editing);
    const statusLevel = options.level === undefined ? (editing ? "" : "warn") : options.level;
    const targetMode = resettableVisitMode(options.mode || currentVisitMode());
    const targetContactType = options.contactType || "customer";
    const targetCustomerType = options.customerType || (targetContactType === "customer" ? "A类" : "");
    const targetContactLevel = options.contactLevel || "";
    clearTimeout(autosaveTimer);
    suppressAutosave = true;
    setDraftOpenScrollRoom(0);
    activeDraftId = "";
    $("#logForm").reset();
    setVisitMode(targetMode, { applyFirst: false });
    setContactType(targetContactType, targetCustomerType, targetContactLevel);
    if (targetMode === "store") {
      setSelectValue("#storeResultSelect", "逛一圈就走");
      setSelectValue("#storeContactSelect", "未留资料");
      syncStoreReceptionLayout({ clearHidden: true });
      syncStoreVisitResultStage();
      syncCustomerTypeLock();
    }
    delete $("#wechatNameInput").dataset.source;
    setWechatAvatarStatus("未上传");
    renderAllUploadPreviews();
    renderIdentityCheckPanel(null);
    renderBuildingOptions();
    renderRoomOptions();
    oldCustomerCascade = { property: "", building: "", customerId: "" };
    oldResourceFilters = { query: "", type: "", level: "" };
    formHasUserChanges = false;
    formTouchedAddress = false;
    suppressAutosave = false;
    renderEmployeeDraftTray();
    setFormEditMode(editing, statusMessage, statusLevel);
    switchView("field");
    if (editing && !options.preserveScroll) {
      $("#buildingSelect").focus();
    } else if (targetMode === "return") {
      renderOldCustomerOptions();
      setOldCustomerStatus(postSubmitTargetMessage("return", options.submittedMode || targetMode), "success");
      $("#oldCustomerCascadeMenu")?.classList.add("is-hidden");
      $("#oldCustomerCascadeButton")?.setAttribute("aria-expanded", "false");
      if (!options.preserveScroll) $("#oldCustomerCascadeButton")?.focus();
    } else if (targetMode === "closed") {
      setLifecyclePickerOpen("closed", false);
      renderClosedCustomers();
      if (!options.preserveScroll) $("#closedCustomerCascadeButton")?.focus();
    } else {
      if (!options.preserveScroll) $("#newEntry").focus();
    }
    if (options.preserveScroll) restoreWindowScroll(options.scrollPosition);
  }

  function startNewLogForEmployee() {
    draftTrayNotice = "";
    const targetMode = isStoreVisitMode() ? "store" : "new";
    const targetContactType = targetMode === "store" ? "customer" : currentContactType();
    const startLabel = targetMode === "store"
      ? "门店接待"
      : (targetContactType === "customer" ? "新客户" : contactTypeLabel(targetContactType));
    const scrollPosition = currentWindowScrollPosition();
    const shouldPreserveCurrent = hasMeaningfulFormInput() || activeDraft();
    if (shouldPreserveCurrent) {
      saveCurrentDraft({ silent: true, force: true });
      resetFormForBlankEntry(`上一条已存为草稿，现在可以填写${startLabel}。`, {
        editing: true,
        mode: targetMode,
        contactType: targetContactType,
        preserveScroll: true,
        scrollPosition
      });
      showToast(`上一条已存为草稿，开始${startLabel}登记`);
      return;
    }

    resetFormForBlankEntry(`已开始${startLabel}登记，填写后会自动保存草稿。`, {
      editing: true,
      mode: targetMode,
      contactType: targetContactType,
      preserveScroll: true,
      scrollPosition
    });
    showToast(`已开始${startLabel}登记`);
  }

  function clearCurrentForm() {
    draftTrayNotice = "";
    if (!formEditMode) {
      setFormEditMode(false, "当前没有正在编辑的表单。需要录入时先点“新登记”。", "warn");
      showToast("当前没有正在编辑的内容");
      return;
    }
    const hasContent = hasMeaningfulFormInput() || activeDraft();
    if (!hasContent) {
      resetFormForBlankEntry("当前没有正在编辑的内容。需要录入时先点“新登记”。", { editing: false });
      showToast("当前没有可清空内容");
      return;
    }
    if (!window.confirm("清空当前正在填写的表单？\n\n如果正在编辑草稿，只会删除这条草稿。\n不会删除已提交日志，也不会删除其他未提交草稿。")) {
      return;
    }

    if (activeDraftId) {
      state.drafts = state.drafts.filter((draft) => draft.id !== activeDraftId);
      saveState();
      renderEmployees();
    }
    resetFormForBlankEntry(
      draftsForCurrentVisitMode(currentEmployeeId()).length
        ? `已清空当前表单。下方还有${currentVisitModeLabel()}草稿可继续编辑。`
        : "已清空，继续录入请点“新登记”。",
      { editing: false }
    );
    showToast("已清空当前表单");
  }

  function deleteDraftFromTray(draftId) {
    const draft = getDraft(draftId);
    if (!draft) {
      renderEmployeeDraftTray();
      return;
    }
    const isActive = draft.id === activeDraftId;
    const title = draftTitle(draft);
    const message = isActive
      ? `删除正在编辑的草稿“${title}”？\n\n删除后当前表单会清空，并回到“未开始登记”。\n不会删除已提交日志，也不会删除其他草稿。`
      : `删除这条草稿“${title}”？\n\n只删除这条未提交草稿。\n不会删除已提交日志，也不会删除其他草稿。`;
    if (!window.confirm(message)) return;

    state.drafts = state.drafts.filter((item) => item.id !== draft.id);
    saveState();
    draftTrayNotice = "";

    if (isActive) {
      activeDraftId = "";
      renderEmployees();
      resetFormForBlankEntry("已删除当前草稿。继续录入请点“新登记”，或选择其他草稿继续编辑。", { editing: false, level: "warn" });
      showToast("当前草稿已删除");
      return;
    }

    renderEmployees();
    renderEmployeeDraftTray();
    clearDraftStatusHint();
    renderDraftStatus();
    showToast("草稿已删除");
  }

  function isCustomPropertySelected() {
    return $("#buildingSelect")?.value === propertyCustomValue;
  }

  function currentPropertyValue() {
    if (isCustomPropertySelected()) {
      return $("#customPropertyInput")?.value.trim() || "";
    }
    return $("#buildingSelect")?.value || "";
  }

  function syncCustomPropertyInput() {
    const field = $("#customPropertyField");
    const input = $("#customPropertyInput");
    const select = $("#buildingSelect");
    if (!field || !input || !select) return;
    const enabled = isCustomPropertySelected() && !select.disabled && !$("#propertyInfoSection")?.classList.contains("is-hidden");
    field.classList.toggle("is-hidden", !isCustomPropertySelected());
    input.disabled = !enabled;
    input.required = enabled;
    if (!isCustomPropertySelected()) input.value = "";
  }

  function setPropertyValue(value = "") {
    const select = $("#buildingSelect");
    if (!select) return;
    const known = mockProperties.some((property) => property.name === value);
    if (known || !value) {
      select.value = known ? value : mockProperties[0].name;
      $("#customPropertyInput").value = "";
    } else {
      select.value = propertyCustomValue;
      $("#customPropertyInput").value = value;
    }
    syncCustomPropertyInput();
    syncScrollPicker("buildingSelect");
  }

  function selectedPropertyConfig() {
    if (isCustomPropertySelected()) return { name: currentPropertyValue() || "其他楼盘", buildings: defaultBuildingNumbers, units: defaultUnits };
    return mockProperties.find((property) => property.name === $("#buildingSelect").value) || mockProperties[0];
  }

  function renderBuildingOptions() {
    const current = currentPropertyValue() || $("#buildingSelect").value || mockProperties[0].name;
    $("#buildingSelect").innerHTML = mockProperties.map((property) => `
      <option value="${property.name}">${property.name}</option>
    `).join("") + `<option value="${propertyCustomValue}">其他</option>`;
    setPropertyValue(current);
    renderBuildingNumberOptions();
    renderUnitOptions();
    syncScrollPicker("buildingSelect");
  }

  function renderBuildingNumberOptions() {
    const property = selectedPropertyConfig();
    const current = $("#buildingNumberSelect").value;
    const buildings = normalizeChoiceList(property.buildings || defaultBuildingNumbers);
    $("#buildingNumberSelect").innerHTML = buildings.map((buildingNumber) => `
      <option value="${buildingNumber}">${buildingNumber}</option>
    `).join("");
    $("#buildingNumberSelect").value = buildings.includes(current) ? current : buildings[0];
  }

  function renderUnitOptions() {
    const property = selectedPropertyConfig();
    const current = $("#unitSelect").value;
    const units = normalizeChoiceList(property.units || defaultUnits);
    $("#unitSelect").innerHTML = units.map((unit) => `
      <option value="${unit}">${unit}</option>
    `).join("");
    $("#unitSelect").value = units.includes(current) ? current : units[0];
  }

  function renderRoomOptions() {
    const rooms = buildRoomOptions();
    const current = $("#roomSelect").value;
    $("#roomSelect").innerHTML = rooms.map((room) => `
      <option value="${room}">${room}</option>
    `).join("");
    $("#roomSelect").value = rooms.includes(current) ? current : rooms[0];
  }

  function currentRenovationResultValue() {
    if ($("#resultSelect")?.value === renovationCustomValue) {
      return $("#customResultInput")?.value.trim() || "";
    }
    return $("#resultSelect")?.value || "暂不清楚";
  }

  function syncCustomResultInput() {
    const field = $("#customResultField");
    const input = $("#customResultInput");
    const select = $("#resultSelect");
    if (!field || !input || !select) return;
    const visible = select.value === renovationCustomValue;
    const enabled = visible && !select.disabled && !$("#siteSituationSection")?.classList.contains("is-hidden");
    field.classList.toggle("is-hidden", !visible);
    input.disabled = !enabled;
    input.required = enabled;
    if (!visible) input.value = "";
  }

  function setRenovationResultValue(value = "") {
    const select = $("#resultSelect");
    if (!select) return;
    const normalized = value || "暂不清楚";
    if (renovationStages.includes(normalized)) {
      select.value = normalized;
      $("#customResultInput").value = "";
    } else {
      select.value = renovationCustomValue;
      $("#customResultInput").value = normalized;
    }
    syncCustomResultInput();
    syncScrollPicker("resultSelect");
  }

  function renderSettings() {
    $("#photoRule").checked = state.rules.photoRequired;
    $("#minPhotos").value = state.rules.minPhotos;
    $("#gapMinutes").value = state.rules.gapMinutes;
  }

  function renderAll() {
    renderMetrics();
    renderMap();
    renderWarnings();
    renderHourChart();
    renderLiveFeed();
    renderEmployees();
    renderLogTable();
    renderChangeLogs();
    renderLeads();
    renderStaff();
    renderEmployeeOptions();
    renderCustomerTracker();
    renderClosedCustomers();
    renderAfterSaleCustomers();
    renderInstalledPaidCustomers();
    renderSettings();
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function renderLogDetailRows(logs, emptyText) {
    if (!logs.length) {
      return `<div class="detail-empty">${escapeHtml(emptyText)}</div>`;
    }

    return logs.map((log) => {
      const contactLevel = displayContactLevel(log);
      const badgeClass = contactLevel ? contactLevelBadgeClass(contactLevel) : receptionBadgeClass(displayReceptionResult(log));
      const siteLabel = contactLevel || displayReceptionResult(log) || "未填写";
      const siteDetail = contactLevel ? "contactLevel" : "reception";
      const siteTitle = contactLevel ? "查看师傅/异业等级" : "查看现场情况";
      const wechatLabel = log.wechatProof ? "微信截图" : "未传微信";
      const wechatClass = log.wechatProof ? "has-proof" : "missing-proof";
      return `
        <article class="detail-row">
          <header>
            <div>
              <strong>${escapeHtml(displayBuilding(log))} · ${escapeHtml(displayRoom(log))}</strong>
              <span class="muted">客户：${escapeHtml(log.customer)}${log.phone ? ` · ${escapeHtml(log.phone)}` : ""}</span>
            </div>
            <span class="timeline-time">${formatTime(log.timestamp)}</span>
          </header>
          <div class="detail-facts">
            <button class="badge ${badgeClass}" type="button" data-log-detail="${siteDetail}" data-log-id="${escapeHtml(log.id)}" title="${siteTitle}">${contactLevel ? "等级" : "现场"}：${escapeHtml(siteLabel)}</button>
            <span class="tag">类型：${escapeHtml(log.visitType || "新增拜访")}</span>
            <button class="tag" type="button" data-log-detail="result" data-log-id="${escapeHtml(log.id)}" title="查看装修进度说明">装修：${escapeHtml(log.result)}</button>
            <button class="tag" type="button" data-log-detail="customerType" data-log-id="${escapeHtml(log.id)}" title="查看客户类型说明">客户类型：${escapeHtml(displayCustomerType(log))}</button>
            <span class="tag">微信：${escapeHtml(displayWechatAdded(log))}</span>
            <button class="tag" type="button" data-log-detail="location" data-log-id="${escapeHtml(log.id)}" title="查看房号详情">房号：${escapeHtml(displayRoom(log))}</button>
            <button class="tag" type="button" data-log-detail="photos" data-log-id="${escapeHtml(log.id)}" title="查看照片凭证">照片：${Number(log.photos || 0)} 张</button>
            <button class="tag" type="button" data-log-detail="duration" data-log-id="${escapeHtml(log.id)}" title="查看停留时间记录方式">停留：${Number(log.duration || 0)} 分钟</button>
            <button class="tag wechat-proof-button ${wechatClass}" type="button" data-wechat-log="${escapeHtml(log.id)}" title="查看员工上传的微信聊天截图">${wechatLabel}</button>
            <button class="tag" type="button" data-log-detail="lock" data-log-id="${escapeHtml(log.id)}" title="查看提交状态">已提交锁定</button>
          </div>
          <div class="muted">纪要：${escapeHtml(log.note || "未填写沟通纪要")}</div>
        </article>
      `;
    }).join("");
  }

  function showDetail(title, subtitle, bodyHtml) {
    $("#detailTitle").textContent = title;
    $("#detailSubtitle").textContent = subtitle;
    $("#detailBody").innerHTML = bodyHtml;
    $("#detailModal").hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeDetail() {
    $("#detailModal").hidden = true;
    document.body.classList.remove("modal-open");
  }

  function logContext(log) {
    const employee = getEmployee(log.employeeId);
    return {
      employee,
      title: `${employee?.name || "员工"} · ${displayBuilding(log)} · ${displayRoom(log)}`,
      subtitle: `${formatTime(log.timestamp)} · 客户：${log.customer || "未填写"}`
    };
  }

  function openLogFieldDetail(logId, detailType) {
    const log = getLog(logId);
    if (!log) return;
    const context = logContext(log);

    if (detailType === "reception") {
      const receptionValue = displayReceptionResult(log);
      const receptionTips = {
        "逛一圈就走": "客户到店简单浏览后离开，先保留联系方式，后续用产品案例或活动信息做轻跟进。",
        "有意向": "客户已经表达购买兴趣，优先跟进产品偏好、预算和下次到店时间。",
        "做了预算，下次再来": "客户已做预算，属于重点客户，按约定时间重点回访。",
        "已成交": "客户已成交，提交后会进入已成交客户区继续维护。",
        "没有开门": "现场没有开门，暂时没有可沟通对象，建议换时间或先联系物业预约。",
        "有师傅": "现场有施工师傅，可以了解装修阶段、施工进度和业主联系方式。",
        "有业主": "现场有业主，建议直接确认家具需求、预算和到店时间。",
        "师傅和业主都在": "现场沟通条件最好，适合同时了解施工进度和业主购买意向。",
        "其他情况": "员工选择了其他情况，具体内容看拜访纪要。"
      };
      showDetail(
        `${log.visitType === "门店接待" ? "门店接待结果" : "现场情况"}：${receptionValue || "未填写"}`,
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>${escapeHtml(receptionValue || "未填写现场情况")}</strong>
                <span class="muted">${escapeHtml(receptionTips[receptionValue] || "这项来自员工现场下拉选择。")}</span>
              </div>
              <span class="badge ${receptionBadgeClass(receptionValue)}">${escapeHtml(receptionValue || "未填写")}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">员工：${escapeHtml(context.employee?.name || "未匹配")}</span>
              <span class="tag">客户类型：${escapeHtml(displayCustomerType(log))}</span>
              <span class="tag">是否添加微信：${escapeHtml(displayWechatAdded(log))}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
              <span class="tag">客户：${escapeHtml(log.customer || "未填写")}</span>
            </div>
            <div class="muted">补充纪要：${escapeHtml(log.receptionOther || log.note || "无补充")}</div>
          </article>
        `
      );
      return;
    }

    if (detailType === "contactLevel") {
      const level = displayContactLevel(log);
      const levelTips = {
        "VIP等级已经介绍客户成交": "这个师傅或渠道已经介绍客户并成交，属于重点维护资源，需要老板和员工持续维护关系。",
        "会介绍客户": "对方有转介绍意愿，员工后续要保持沟通，及时提醒可介绍装修客户。",
        "常沟通没介绍过客户": "平时有联系但还没有介绍成交，需要继续培养信任。",
        "少联系": "联系较少或关系较弱，先做基础维护，不作为近期重点。"
      };
      showDetail(
        `等级：${level}`,
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>${escapeHtml(level)}</strong>
                <span class="muted">${escapeHtml(levelTips[level] || "这项来自员工下拉选择的师傅/异业等级。")}</span>
              </div>
              <span class="badge ${contactLevelBadgeClass(level)}">${escapeHtml(level)}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">信息类型：${escapeHtml(contactTypeLabel(log.contactType))}</span>
              <span class="tag">分类：${escapeHtml(displayCustomerType(log))}</span>
              <span class="tag">姓名：${escapeHtml(log.customer || "未填写")}</span>
              <span class="tag">电话：${escapeHtml(log.phone || "未留电话")}</span>
              <span class="tag">是否添加微信：${escapeHtml(displayWechatAdded(log))}</span>
              <span class="tag">负责人：${escapeHtml(context.employee?.name || "未匹配")}</span>
            </div>
            <div class="muted">备注：${escapeHtml(log.note || "未填写沟通纪要")}</div>
          </article>
        `
      );
      return;
    }

    if (detailType === "result") {
      const resultTips = {
        "拆改": "刚开始施工，适合建立联系，先了解户型、预算和业主时间。",
        "水电": "水电阶段离家具进场还早，但适合提前锁定需求和风格。",
        "瓷砖": "瓷砖阶段客户开始关注整体效果，可以推荐成套家具和软装方案。",
        "木工": "木工阶段空间尺寸逐渐明确，适合邀约量尺或到店看样。",
        "油漆": "油漆阶段离家具进场更近，需要重点跟进交付时间。",
        "吊顶": "吊顶阶段可以确认灯位、空间风格和家具尺寸。",
        "定制安装": "定制安装阶段成交窗口较近，适合推进到店和报价。",
        "软装进场": "软装进场阶段需求紧迫，应重点跟进现货和套餐。",
        "已入住": "已入住客户可能以补充家具、换新、软装为主。",
        "暂不清楚": "员工现场无法判断装修阶段，后续需要补充确认。"
      };
      showDetail(
        `装修进度：${log.result}`,
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>${escapeHtml(log.customer || "未填写客户")}</strong>
                <span class="muted">${escapeHtml(resultTips[log.result] || "这项来自员工现场下拉选择的装修进度。")}</span>
              </div>
                <span class="badge ${renovationBadgeClass(log.result)}">${escapeHtml(log.result)}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">电话：${escapeHtml(log.phone || "未留电话")}</span>
              <span class="tag">是否添加微信：${escapeHtml(displayWechatAdded(log))}</span>
              <span class="tag">楼盘：${escapeHtml(displayBuilding(log))}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
              <span class="tag">负责人：${escapeHtml(context.employee?.name || "未匹配")}</span>
            </div>
            <div class="muted">纪要：${escapeHtml(log.note || "未填写沟通纪要")}</div>
          </article>
        `
      );
      return;
    }

    if (detailType === "customerType") {
      const typeTips = {
        "A类": "重点客户：需求明确、近期可能成交，需要当天或次日重点跟进。",
        "B类": "潜力客户：有需求但时间或预算还需确认，建议持续跟进。",
        "C类": "普通客户：信息不完整或需求较弱，保持记录等待机会。",
        "D类": "低优先级：暂时没有明显需求，主要用于扫楼覆盖统计。"
      };
      showDetail(
        `客户类型：${displayCustomerType(log)}`,
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>${escapeHtml(displayCustomerType(log))}</strong>
                <span class="muted">${escapeHtml(typeTips[log.customerType] || "这项来自员工现场下拉选择的客户类型。")}</span>
              </div>
              <span class="badge info">${escapeHtml(displayCustomerType(log))}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">装修进度：${escapeHtml(log.result || "未填写")}</span>
              <span class="tag">客户：${escapeHtml(log.customer || "未填写")}</span>
              <span class="tag">是否添加微信：${escapeHtml(displayWechatAdded(log))}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
              <span class="tag">负责人：${escapeHtml(context.employee?.name || "未匹配")}</span>
            </div>
          </article>
        `
      );
      return;
    }

    if (detailType === "location") {
      const source = log.locationSource || "房号下拉选择，可附加定位坐标";
      showDetail(
        "房号详情",
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>${escapeHtml(displayRoom(log))}</strong>
                <span class="muted">记录来源：${escapeHtml(source)}</span>
              </div>
              <span class="timeline-time">${formatTime(log.timestamp)}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">员工：${escapeHtml(context.employee?.name || "未匹配")}</span>
              <span class="tag">楼盘：${escapeHtml(displayBuilding(log))}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
              <span class="tag">定位：${escapeHtml(log.location || "未填写")}</span>
              <span class="tag">客户：${escapeHtml(log.customer || "未填写")}</span>
            </div>
          </article>
        `
      );
      return;
    }

    if (detailType === "lock") {
      showDetail(
        "提交状态：已提交锁定",
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>正式日志不可再修改</strong>
                <span class="muted">这条记录已经进入老板端日志审核和统计，不再作为草稿开放编辑。</span>
              </div>
              <span class="badge good">已提交锁定</span>
            </header>
            <div class="detail-facts">
              <span class="tag">员工：${escapeHtml(context.employee?.name || "未匹配")}</span>
              <span class="tag">提交时间：${formatTime(log.timestamp)}</span>
              <span class="tag">客户：${escapeHtml(log.customer || "未填写")}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
            </div>
          </article>
        `
      );
      return;
    }

    if (detailType === "photos") {
      const photoCount = Number(log.photos || 0);
      const names = Array.isArray(log.photoNames) && log.photoNames.length
        ? log.photoNames
        : Array.from({ length: photoCount }, (_, index) => `现场照片 ${index + 1}`);
      showDetail(
        "照片凭证明细",
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>共 ${photoCount} 张现场照片</strong>
                <span class="muted">当前原型记录照片数量和文件名，正式系统可接入图片上传后查看原图。</span>
              </div>
              <span class="timeline-time">${formatTime(log.timestamp)}</span>
            </header>
            <div class="detail-facts">
              ${photoCount ? names.map((name) => `<span class="tag">${escapeHtml(name)}</span>`).join("") : `<span class="tag">未提交照片</span>`}
            </div>
          </article>
        `
      );
      return;
    }

    if (detailType === "duration") {
      const source = log.durationSource || "员工下拉选择";
      showDetail(
        "停留时间记录方式",
        context.title,
        `
          <article class="detail-row">
            <header>
              <div>
                <strong>本次记录：${Number(log.duration || 0)} 分钟</strong>
                <span class="muted">当前来源：${escapeHtml(source)}</span>
              </div>
              <span class="timeline-time">${formatTime(log.timestamp)}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">到访楼盘：${escapeHtml(displayBuilding(log))}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
              <span class="tag">客户：${escapeHtml(log.customer || "未填写")}</span>
              <span class="tag">员工：${escapeHtml(context.employee?.name || "未匹配")}</span>
            </div>
            <div class="detail-note">
              当前按你的要求由员工自己选择，不需要打字输入。后续如果要更严格，再增加“到达打卡”和“离开打卡”自动计算。
            </div>
          </article>
        `
      );
    }
  }

  function renderWechatMessages(messages) {
    return (messages || []).map((message) => `
      <div class="wechat-message ${message.from === "customer" ? "customer" : "staff"}">
        <span>${escapeHtml(message.time || "")}</span>
        <p>${escapeHtml(message.text || "")}</p>
      </div>
    `).join("");
  }

  function openWechatProof(logId) {
    const log = getLog(logId);
    if (!log) return;
    const context = logContext(log);
    const proof = log.wechatProof;

    if (!proof) {
      showDetail(
        "微信聊天截图未上传",
        context.title,
        `
          <div class="detail-empty">
            这条拜访日志还没有上传微信聊天截图。员工后续可以在提交日志时上传截图、填写客户微信昵称和客户跟进阶段。
          </div>
        `
      );
      return;
    }

    const proofFileNames = normalizeFileNames(proof.fileNames, proof.fileName || log.wechatFileName);
    const proofFileLabel = proofFileNames.length
      ? `共 ${proofFileNames.length} 张：${proofFileNames.join("、")}`
      : "未记录文件名";

    showDetail(
      "微信聊天截图信息",
      `${context.title} · ${proof.isSample ? "样板数据" : "员工上传"}`,
      `
        <div class="wechat-proof-grid">
          <article class="wechat-preview">
            <header>
              <strong>微信聊天截图预览</strong>
              <span class="muted">${escapeHtml(proofFileLabel)}</span>
            </header>
            <div class="wechat-phone">
              <div class="wechat-topbar">${escapeHtml(proof.customerWechat || log.customer || "客户微信")}</div>
              <div class="wechat-screen">
                ${renderWechatMessages(proof.messages)}
              </div>
            </div>
          </article>

          <article class="detail-row wechat-info">
            <header>
              <div>
                <strong>${escapeHtml(proof.customerWechat || log.customer || "未填写微信昵称")}</strong>
                <span class="muted">上传人：${escapeHtml(context.employee?.name || "未匹配员工")} · ${formatTime(proof.uploadTime || log.timestamp)}</span>
              </div>
              <span class="badge info">${escapeHtml(proof.stage || "微信记录")}</span>
            </header>
            <div class="detail-facts">
              <span class="tag">客户：${escapeHtml(log.customer || "未填写")}</span>
              <span class="tag">电话：${escapeHtml(log.phone || "未留电话")}</span>
              <span class="tag">是否添加微信：${escapeHtml(displayWechatAdded(log))}</span>
              ${proof.avatarFileName || log.wechatAvatarFileName ? `<span class="tag">微信主页截图：${escapeHtml(proof.avatarFileName || log.wechatAvatarFileName)}</span>` : ""}
              ${proofFileNames.map((name, index) => `<span class="tag">聊天截图${index + 1}：${escapeHtml(name)}</span>`).join("")}
              <span class="tag">楼盘：${escapeHtml(displayBuilding(log))}</span>
              <span class="tag">房号：${escapeHtml(displayRoom(log))}</span>
            </div>
            <div class="detail-note">${escapeHtml(proof.summary || "未填写微信聊天摘要")}</div>
            <div class="muted">下一步：${escapeHtml(proof.nextStep || "未填写下一步跟进计划")}</div>
            ${proof.note ? `<div class="muted">${escapeHtml(proof.note)}</div>` : ""}
          </article>
        </div>
      `
    );
  }

  function openEmployeeDetail(employeeId, detailType, routeName = "") {
    const employee = getEmployee(employeeId);
    if (!employee) return;

    if (detailType === "visits") {
      const logs = employeeLogs(employeeId);
      showDetail(
        `${employee.name}的今日拜访明细`,
        `${employee.region} · 共 ${logs.length} 条拜访日志`,
        renderLogDetailRows(logs, "这个员工今天还没有提交拜访日志。")
      );
      return;
    }

    if (detailType === "leads") {
      const logs = leadLogs(employeeId);
      showDetail(
        `${employee.name}的重点客户`,
        "包含A类和B类客户",
        renderLogDetailRows(logs, "这个员工今天还没有A/B类重点客户。")
      );
      return;
    }

    if (detailType === "photos") {
      const logs = employeeLogs(employeeId).filter((log) => Number(log.photos || 0) > 0);
      const totalPhotos = logs.reduce((sum, log) => sum + Number(log.photos || 0), 0);
      showDetail(
        `${employee.name}的照片凭证明细`,
        `今日共 ${totalPhotos} 张现场照片`,
        renderLogDetailRows(logs, "这个员工今天还没有提交现场照片。")
      );
      return;
    }

    if (detailType === "target") {
      const stats = employeeStats(employeeId);
      const percent = Math.min(Math.round((stats.visits / employee.target) * 100), 100);
      const summary = `
        <article class="detail-row">
          <header>
            <div>
              <strong>今日目标完成情况</strong>
              <span class="muted">已拜访 ${stats.visits} 次，目标 ${employee.target} 次</span>
            </div>
            <span class="badge ${percent >= 80 ? "good" : "warn"}">${percent}%</span>
          </header>
          <div class="progress-head">
            <span>今日目标进度</span>
            <b>${percent}%</b>
          </div>
          <div class="progress-track"><span class="progress-fill" style="--value:${percent}%"></span></div>
        </article>
      `;
      showDetail(
        `${employee.name}的目标完成情况`,
        `${employee.region} · 每日目标 ${employee.target} 次`,
        summary + renderLogDetailRows(employeeLogs(employeeId), "这个员工今天还没有提交拜访日志。")
      );
      return;
    }

    if (detailType === "route") {
      const logs = employeeLogs(employeeId).filter((log) => {
        const building = displayBuilding(log);
        return building.includes(routeName) || routeName.includes(building);
      });
      showDetail(
        `${employee.name} · ${routeName}`,
        "路线点对应的拜访记录",
        renderLogDetailRows(logs, `今天还没有提交“${routeName}”这个路线点的拜访记录。`)
      );
    }
  }

  function switchView(view) {
    const meta = viewMeta[view] || viewMeta.overview;
    const role = meta.role;
    activeRole = role;
    document.body.dataset.role = role;

    $$("[data-role-switch]").forEach((button) => {
      button.classList.toggle("active", button.dataset.roleSwitch === role);
    });
    $$("[data-role-label]").forEach((label) => {
      label.classList.toggle("is-hidden", label.dataset.roleLabel !== role);
    });
    $$(".nav-item").forEach((button) => {
      button.classList.toggle("is-hidden", button.dataset.role !== role);
      button.classList.toggle("active", button.dataset.view === view);
    });
    $$(".view").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.viewPanel === view);
    });
    $("#topbarEyebrow").textContent = meta.eyebrow;
    $("#topbarTitle").textContent = meta.title;
    $("#bossTopbarActions").classList.toggle("is-hidden", role !== "boss");
    renderEmployees();
    if (view === "customers") {
      renderCustomerTracker();
    }
  }

  function switchRole(role) {
    switchView(role === "employee" ? "field" : "overview");
  }

  function applyRuleUpdates() {
    state.rules.photoRequired = $("#photoRule").checked;
    state.rules.minPhotos = Number($("#minPhotos").value);
    state.rules.gapMinutes = Number($("#gapMinutes").value);
    saveState();
    renderAll();
  }

  function mergeSubmittedLogIntoSource(submittedLog) {
    const sourceLog = submittedLog.oldCustomerLogId ? getLog(submittedLog.oldCustomerLogId) : null;
    if (!sourceLog) return { changed: false, reason: "" };
    const isResource = ["master", "channel"].includes(submittedLog.contactType || "customer");
    const reason = isResource
      ? resourceIdentityMatchReason(submittedLog, sourceLog) || "原资料回访"
      : customerIdentityMatchReason(submittedLog, sourceLog) || "原客户回访";
    let changed = false;
    const overwrite = true;
    [
      ["customer", submittedLog.customer],
      ["phone", submittedLog.phone],
      ["customerType", submittedLog.customerType],
      ["contactLevel", submittedLog.contactLevel],
      ["wechatAdded", submittedLog.wechatAdded],
      ["wechatName", submittedLog.wechatName],
      ["wechatNameSource", submittedLog.wechatNameSource],
      ["wechatFileName", submittedLog.wechatFileName],
      ["wechatAvatarFileName", submittedLog.wechatAvatarFileName],
      ["wechatHomepageFingerprint", submittedLog.wechatHomepageFingerprint]
    ].forEach(([field, value]) => {
      changed = setExistingField(sourceLog, field, value, { overwrite }) || changed;
    });
    const mergedWechatFiles = compactArrayValue(sourceLog.wechatFileNames, submittedLog.wechatFileNames);
    if (mergedWechatFiles.length && JSON.stringify(sourceLog.wechatFileNames || []) !== JSON.stringify(mergedWechatFiles)) {
      sourceLog.wechatFileNames = mergedWechatFiles;
      changed = true;
    }
    if (!isResource) {
      changed = syncAddressFields(sourceLog, submittedLog, { overwrite: false }) || changed;
      if (submittedLog.result && submittedLog.result !== "暂不清楚" && sourceLog.result !== submittedLog.result) {
        sourceLog.result = submittedLog.result;
        changed = true;
      }
    }
    if (changed) {
      sourceLog.masterRecordUpdatedAt = new Date().toISOString();
      sourceLog.masterRecordUpdateReason = reason;
    }
    return { changed, reason };
  }

  function addLog(log) {
    state.logs.unshift(log);
    const employee = getEmployee(log.employeeId);
    employee.status = "working";
    employee.map.x = Math.max(12, Math.min(88, employee.map.x + Math.round((Math.random() - 0.5) * 12)));
    employee.map.y = Math.max(16, Math.min(84, employee.map.y + Math.round((Math.random() - 0.5) * 12)));
    saveState();
    renderAll();
  }

  function exportCsv() {
    const header = ["时间", "登记类型", "信息类型", "员工", "楼盘", "房号", "姓名", "电话", "现场情况/等级", "装修进度", "分类", "是否添加微信", "定位", "照片", "停留分钟", "纪要"];
    const rows = logsForSelectedDate()
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((log) => {
        const employee = getEmployee(log.employeeId);
        return [
          formatTime(log.timestamp),
          log.visitType || "新增拜访",
          contactTypeLabel(log.contactType),
          employee.name,
          displayBuilding(log),
          displayRoom(log),
          log.customer,
          log.phone || "",
          displayContactLevel(log) || log.reception || "",
          log.result,
          displayCustomerType(log),
          displayWechatAdded(log),
          log.location || "",
          log.photos || 0,
          log.duration,
          log.note || ""
        ];
      });
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `外勤日志-${$("#workDate").value}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function simulateSync() {
    const employee = state.employees[Math.floor(Math.random() * state.employees.length)];
    const customers = ["物业前台", "孙先生", "何女士", "装修负责人", "招商经理"];
    const receptions = ["没有开门", "有师傅", "有业主", "师傅和业主都在"];
    const durations = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60];
    const property = mockProperties[Math.floor(Math.random() * mockProperties.length)];
    const buildingNumber = property.buildings[Math.floor(Math.random() * property.buildings.length)];
    const unit = property.units[Math.floor(Math.random() * property.units.length)];
    const index = Math.floor(Math.random() * customers.length);
    const roomOptions = buildRoomOptions();
    const room = roomOptions[Math.floor(Math.random() * roomOptions.length)];
    const floor = extractFloor(room) || "1";
    const timestamp = new Date().toISOString();
    const wechatAdded = Math.random() > 0.45 ? "有" : "没有";
    const syncedLog = {
      id: `log-${Date.now()}`,
      employeeId: employee.id,
      timestamp,
      property: property.name,
      buildingNumber,
      unit,
      building: `${property.name} ${buildingNumber}${unit}`,
      room,
      customer: customers[index],
      phone: "",
      reception: receptions[Math.floor(Math.random() * receptions.length)],
      result: renovationStages[Math.floor(Math.random() * renovationStages.length)],
      customerType: customerTypes[Math.floor(Math.random() * customerTypes.length)],
      wechatAdded,
      floor,
      location: `${floor} 层`,
      locationSource: "模拟同步生成",
      photos: Math.ceil(Math.random() * 3),
      photoNames: ["模拟现场照片"],
      duration: durations[Math.floor(Math.random() * durations.length)],
      durationSource: "模拟同步生成",
      note: "现场新增同步记录。"
    };
    if (syncedLog.reception === "没有开门") {
      syncedLog.duration = 0;
    }
    if (syncedLog.wechatAdded === "有") {
      syncedLog.wechatProof = buildSampleWechatProof(syncedLog, employee);
    }

    addLog(syncedLog);
    $("#syncState").textContent = `刚刚模拟同步 ${employee.name}`;
    showToast("已模拟同步一条外勤日志");
  }

  function bindEvents() {
    $$("[data-role-switch]").forEach((button) => {
      button.addEventListener("click", () => switchRole(button.dataset.roleSwitch));
    });

    $$(".nav-item").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });

    $("#workDate").addEventListener("change", renderAll);
    $("#regionFilter").addEventListener("change", renderAll);
    $("#simulateSync").addEventListener("click", simulateSync);
    $("#exportCsv").addEventListener("click", exportCsv);
    $("#logSearch").addEventListener("input", renderLogTable);
    $("#statusFilter").addEventListener("change", renderLogTable);
    $$("[data-section-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const bodyId = button.dataset.sectionToggle;
        collapsibleSectionState[bodyId] = !collapsibleSectionState[bodyId];
        syncCollapsibleSection(bodyId);
      });
    });
    $("#buildingSelect").addEventListener("change", () => {
      syncCustomPropertyInput();
      renderBuildingNumberOptions();
      renderUnitOptions();
      syncScrollPicker("buildingSelect");
    });
    $("#customPropertyInput").addEventListener("input", () => {
      syncScrollPicker("buildingSelect");
      refreshIdentityCheckFromForm();
    });
    $("#receptionSelect").addEventListener("change", syncDurationWithReception);
    $("#resultSelect").addEventListener("change", () => {
      syncCustomResultInput();
      syncScrollPicker("resultSelect");
    });
    $("#customResultInput").addEventListener("input", () => {
      syncScrollPicker("resultSelect");
    });
    $("#wechatAddedSelect").addEventListener("change", () => {
      if ($("#wechatAddedSelect").value === "没有" && syncWechatAddedByProof(activeDraft() || {})) {
        showToast("已有微信截图，系统自动改为“有”");
      }
      syncWechatNameRequirement(activeDraft() || {});
    });
    $("#storeResultSelect").addEventListener("change", () => {
      if (!isStoreVisitMode()) return;
      const result = normalizeStoreVisitResult($("#storeResultSelect").value);
      $("#storeResultSelect").value = result;
      syncStoreReceptionLayout({ clearHidden: true });
      syncFormLayoutByMode();
      const stage = syncStoreVisitResultStage();
      syncCustomerTypeLock();
      if (result === "已成交") {
        showToast("已成交客户提交后会转入已成交区");
      } else if (stage === "已做过预算") {
        showToast("已记录预算客户，提交后会联动客户资料");
      }
    });
    $("#storeContactSelect").addEventListener("change", () => {
      if (!isStoreVisitMode()) return;
      syncStoreReceptionLayout({ clearHidden: true });
      syncFormLayoutByMode();
    });
    $("#wechatStageInput").addEventListener("change", () => {
      let stage = normalizeCustomerFollowStage($("#wechatStageInput").value);
      if (isStoreVisitMode() && customerFollowStageRank(stage) < customerFollowStageRank("已到过店")) {
        stage = "已到过店";
        showToast("门店接待客户已自动标为到过店");
      }
      $("#wechatStageInput").value = stage;
      syncCustomerTypeLock();
      if (shouldForceCustomerTypeA(stage)) {
        showToast(stage === "已成交" ? "已成交客户提交后会转入已成交区" : "已自动升为A类，不能再降级");
      }
    });
    $("#customerTypeSelect").addEventListener("change", () => {
      syncChannelIndustryInput();
      syncCustomerTypeLock();
      syncOldResourceFiltersFromForm({ render: true });
    });
    $("#channelIndustryCustomInput").addEventListener("input", () => {
      syncOldResourceFiltersFromForm({ render: true });
    });
    $("#contactLevelSelect").addEventListener("change", () => {
      syncOldResourceFiltersFromForm({ render: true });
    });
    Object.keys(uploadPreviewConfig).forEach((inputId) => {
      const input = $(`#${inputId}`);
      if (input) {
        input.addEventListener("change", () => handleUploadInputChange(inputId));
      }
    });
    $("#logForm").addEventListener("input", scheduleAutosave);
    $("#logForm").addEventListener("change", scheduleAutosave);
    $("#logForm").addEventListener("click", (event) => {
      const scrollPickerTrigger = event.target.closest("[data-scroll-picker]");
      if (scrollPickerTrigger) {
        event.preventDefault();
        event.stopPropagation();
        if (!formEditMode && !isFormLockExempt(scrollPickerTrigger)) {
          promptStartFormEdit();
          return;
        }
        toggleScrollPicker(scrollPickerTrigger.dataset.scrollPicker);
        return;
      }

      const scrollPickerOption = event.target.closest("[data-scroll-option]");
      if (scrollPickerOption) {
        event.preventDefault();
        event.stopPropagation();
        chooseScrollPickerOption(scrollPickerOption.dataset.scrollOption, scrollPickerOption.dataset.scrollValue);
        return;
      }

      const storeResultButton = event.target.closest("[data-store-result]");
      if (storeResultButton) {
        event.preventDefault();
        event.stopPropagation();
        if (!formEditMode) {
          promptStartFormEdit();
          return;
        }
        $("#storeResultSelect").value = storeResultButton.dataset.storeResult;
        syncStoreReceptionLayout({ clearHidden: true });
        syncFormLayoutByMode();
        scheduleAutosave();
        return;
      }

      const storeContactButton = event.target.closest("[data-store-contact]");
      if (storeContactButton) {
        event.preventDefault();
        event.stopPropagation();
        if (!formEditMode) {
          promptStartFormEdit();
          return;
        }
        $("#storeContactSelect").value = storeContactButton.dataset.storeContact;
        syncStoreReceptionLayout({ clearHidden: true });
        syncFormLayoutByMode();
        scheduleAutosave();
        return;
      }

      const deleteDraftButton = event.target.closest("[data-delete-draft]");
      if (deleteDraftButton) {
        event.preventDefault();
        deleteDraftFromTray(deleteDraftButton.dataset.deleteDraft);
        return;
      }

      const draftButton = event.target.closest(".open-draft");
      if (draftButton) {
        event.preventDefault();
        loadDraftToForm(draftButton.dataset.draft, {
          anchorTop: draftButton.getBoundingClientRect().top,
          listScrollTop: draftButton.closest(".draft-quick-list")?.scrollTop || 0,
          scrollPosition: currentWindowScrollPosition()
        });
        return;
      }

      const identityActionButton = event.target.closest("[data-identity-action]");
      if (identityActionButton) {
        event.preventDefault();
        event.stopPropagation();
        const action = identityActionButton.dataset.identityAction;
        if (action === "use-existing") {
          linkCurrentFormToExistingRecord(identityActionButton.dataset.logId);
          return;
        }
        if (action === "edit-contact") {
          const input = $("#phoneInput");
          collapsibleSectionState.customerInfoBody = false;
          syncCollapsibleSection("customerInfoBody");
          setDraftStatusHint("请核对电话号码；确认无误后再提交。", "warn");
          input?.focus();
          input?.select();
          showToast("请核对电话号码");
          return;
        }
        if (action === "save-draft") {
          saveCurrentDraft();
          refreshIdentityCheckFromForm();
          return;
        }
      }

      if (!formEditMode && !isFormLockExempt(event.target)) {
        event.preventDefault();
        promptStartFormEdit();
        return;
      }

      const trigger = event.target.closest("[data-upload-trigger]");
      if (trigger) {
        const input = $(`#${trigger.dataset.uploadTrigger}`);
        if (input) input.click();
        return;
      }

      const removeButton = event.target.closest("[data-upload-remove]");
      if (removeButton) {
        removeUploadFile(removeButton.dataset.uploadRemove, Number(removeButton.dataset.uploadIndex));
      }
    });
    $("#saveDraft").addEventListener("click", (event) => {
      event.preventDefault();
      saveCurrentDraft();
    });
    $("#newEntry").addEventListener("click", startNewLogForEmployee);
    $("#clearForm")?.addEventListener("click", clearCurrentForm);
    $("#logForm").querySelector('button[type="submit"]').addEventListener("click", expandVisibleEmployeeSections);
    unlockVisitModeButtons();
    $(".visit-mode")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-visit-mode]");
      if (!button) return;
      event.preventDefault();
      unlockVisitModeButtons();
      switchVisitModeFromUser(button.dataset.visitMode);
    });
    $$(".visit-mode button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        unlockVisitModeButtons();
        switchVisitModeFromUser(button.dataset.visitMode);
      });
    });
    $$("[data-contact-type]").forEach((button) => {
      button.addEventListener("click", () => switchContactType(button.dataset.contactType));
    });
    $("#oldCustomerCascadeButton").addEventListener("click", () => {
      const menu = $("#oldCustomerCascadeMenu");
      const nextOpen = menu.classList.contains("is-hidden");
      menu.classList.toggle("is-hidden", !nextOpen);
      $("#oldCustomerCascadeButton").setAttribute("aria-expanded", String(nextOpen));
      if (nextOpen && currentContactType() !== "customer") {
        syncOldResourceFiltersFromForm({ keepSelection: true });
        renderOldResourceOptions($("#oldCustomerSelect").value);
        setTimeout(() => $("#oldResourceSearchInput")?.focus(), 0);
      } else if (nextOpen && oldCustomerTemplate === "search") {
        setTimeout(() => $("#oldCustomerSearchInput")?.focus(), 0);
      }
    });
    $("#closedCustomerCascadeButton")?.addEventListener("click", () => {
      const nextOpen = !isLifecyclePickerOpen("closed");
      setLifecyclePickerOpen("closed", nextOpen);
      if (nextOpen) {
        setTimeout(() => $("#closedCustomerSearch")?.focus(), 0);
      }
    });
    $("#closedCustomerSearch")?.addEventListener("input", renderClosedCustomers);
    $("#closedCustomerCascadeMenu")?.addEventListener("click", (event) => {
      const templateButton = event.target.closest("[data-closed-template]");
      if (!templateButton) return;
      event.preventDefault();
      event.stopPropagation();
      closedCustomerTemplate = templateButton.dataset.closedTemplate || "search";
      renderClosedCustomers();
      if (closedCustomerTemplate === "search") {
        setTimeout(() => $("#closedCustomerSearch")?.focus(), 0);
      }
    });
    $("#closedCustomerCascadeMenu")?.addEventListener("change", (event) => {
      const propertyFilter = event.target.closest("#closedCustomerPropertyFilter");
      if (propertyFilter) {
        closedCustomerFilters.property = propertyFilter.value;
        closedCustomerFilters.building = "";
        renderClosedCustomers();
        return;
      }

      const buildingFilter = event.target.closest("#closedCustomerBuildingFilter");
      if (buildingFilter) {
        closedCustomerFilters.building = buildingFilter.value;
        renderClosedCustomers();
      }
    });
    $("#closedCustomerList")?.addEventListener("click", (event) => {
      const customerButton = event.target.closest("[data-closed-customer]");
      if (!customerButton) return;
      event.preventDefault();
      event.stopPropagation();
      activeClosedCustomerId = customerButton.dataset.closedCustomer;
      if ($("#closedCustomerSearch")) $("#closedCustomerSearch").value = "";
      setLifecyclePickerOpen("closed", false);
      renderClosedCustomers();
    });
    $("#closedCustomerDetail")?.addEventListener("click", (event) => {
      const imageTrigger = event.target.closest("[data-deal-image-trigger]");
      if (imageTrigger) {
        event.preventDefault();
        event.stopPropagation();
        $("#dealImageInput")?.click();
        return;
      }

      const saveButton = event.target.closest("[data-save-closed-archive]");
      if (saveButton) {
        event.preventDefault();
        event.stopPropagation();
        saveClosedArchive(saveButton.dataset.saveClosedArchive);
        return;
      }

      const draftButton = event.target.closest("[data-save-closed-draft]");
      if (draftButton) {
        event.preventDefault();
        event.stopPropagation();
        saveClosedArchiveDraft(draftButton.dataset.saveClosedDraft);
        return;
      }

      const choiceButton = event.target.closest("[data-deal-choice-field]");
      if (choiceButton) {
        event.preventDefault();
        event.stopPropagation();
        if (choiceButton.disabled || employeeCommissionLocked()) {
          showToast("销售分成和提成点数需要老板权限");
          return;
        }
        const input = $(`#${choiceButton.dataset.dealChoiceField}`);
        if (input) input.value = choiceButton.dataset.dealChoiceValue;
        choiceButton.closest(".deal-choice-grid")?.querySelectorAll(".deal-choice-button").forEach((button) => {
          button.classList.toggle("active", button === choiceButton);
        });
        updateDealArchiveAmountViews();
        return;
      }

      const recordButton = event.target.closest("[data-closed-log]");
      if (recordButton) {
        event.preventDefault();
        event.stopPropagation();
        openClosedCustomerRecord(recordButton.dataset.closedLog);
      }
    });
    $("#closedCustomerDetail")?.addEventListener("change", (event) => {
      const editSelect = event.target.closest("[data-closed-edit]");
      if (editSelect) {
        updateClosedCustomerField(editSelect.dataset.closedEdit, editSelect.dataset.closedField, editSelect.value);
        return;
      }

      if (event.target.closest("#dealImageInput")) {
        handleDealImageUpload();
      }
    });
    $("#closedCustomerDetail")?.addEventListener("input", (event) => {
      if (event.target.closest("#dealOrderAmount")) {
        updateDealArchiveAmountViews();
      }
    });
    $("#afterSaleSummary")?.addEventListener("click", (event) => {
      const filterButton = event.target.closest("[data-after-sale-filter]");
      if (!filterButton) return;
      event.preventDefault();
      event.stopPropagation();
      activeAfterSaleFilter = activeAfterSaleFilter === filterButton.dataset.afterSaleFilter ? "" : filterButton.dataset.afterSaleFilter;
      activeAfterSaleCustomerId = "";
      renderAfterSaleCustomers();
    });
    $("#afterSaleCascadeButton")?.addEventListener("click", () => {
      const nextOpen = !isLifecyclePickerOpen("afterSale");
      setLifecyclePickerOpen("afterSale", nextOpen);
      if (nextOpen) {
        setTimeout(() => $("#afterSaleSearch")?.focus(), 0);
      }
    });
    $("#afterSaleSearch")?.addEventListener("input", () => {
      setLifecyclePickerOpen("afterSale", true);
      renderAfterSaleCustomers();
    });
    $("#afterSaleSearch")?.addEventListener("focus", () => {
      setLifecyclePickerOpen("afterSale", true);
      renderAfterSaleCustomers();
    });
    $("#afterSaleCascadeMenu")?.addEventListener("click", (event) => {
      const templateButton = event.target.closest("[data-after-sale-template]");
      if (!templateButton) return;
      event.preventDefault();
      event.stopPropagation();
      afterSaleTemplate = templateButton.dataset.afterSaleTemplate || "search";
      renderAfterSaleCustomers();
      if (afterSaleTemplate === "search") {
        setTimeout(() => $("#afterSaleSearch")?.focus(), 0);
      }
    });
    $("#afterSaleCascadeMenu")?.addEventListener("change", (event) => {
      const propertyFilter = event.target.closest("#afterSalePropertyFilter");
      if (propertyFilter) {
        afterSaleFilters.property = propertyFilter.value;
        afterSaleFilters.building = "";
        renderAfterSaleCustomers();
        return;
      }

      const buildingFilter = event.target.closest("#afterSaleBuildingFilter");
      if (buildingFilter) {
        afterSaleFilters.building = buildingFilter.value;
        renderAfterSaleCustomers();
      }
    });
    $("#afterSaleList")?.addEventListener("click", (event) => {
      const customerButton = event.target.closest("[data-after-sale-customer]");
      if (customerButton) {
        event.preventDefault();
        event.stopPropagation();
        activeAfterSaleCustomerId = customerButton.dataset.afterSaleCustomer;
        if ($("#afterSaleSearch")) $("#afterSaleSearch").value = "";
        setLifecyclePickerOpen("afterSale", false);
        renderAfterSaleCustomers();
        return;
      }
    });
    $("#afterSaleDetail")?.addEventListener("click", (event) => {
      const draftButton = event.target.closest("[data-save-after-sale-draft]");
      if (draftButton) {
        event.preventDefault();
        event.stopPropagation();
        saveAfterSaleDraft(draftButton.dataset.saveAfterSaleDraft);
        return;
      }

      const saveButton = event.target.closest("[data-save-after-sale]");
      if (saveButton) {
        event.preventDefault();
        event.stopPropagation();
        saveAfterSaleStatus(saveButton.dataset.saveAfterSale);
        return;
      }

      const recordButton = event.target.closest("[data-closed-log]");
      if (recordButton) {
        event.preventDefault();
        event.stopPropagation();
        openClosedCustomerRecord(recordButton.dataset.closedLog);
      }
    });
    $("#installedPaidSummary")?.addEventListener("click", (event) => {
      const filterButton = event.target.closest("[data-installed-paid-filter]");
      if (!filterButton) return;
      event.preventDefault();
      event.stopPropagation();
      activeInstalledPaidFilter = activeInstalledPaidFilter === filterButton.dataset.installedPaidFilter ? "" : filterButton.dataset.installedPaidFilter;
      activeInstalledPaidCustomerId = "";
      renderInstalledPaidCustomers();
    });
    $("#installedPaidCascadeButton")?.addEventListener("click", () => {
      const nextOpen = !isLifecyclePickerOpen("installedPaid");
      setLifecyclePickerOpen("installedPaid", nextOpen);
      if (nextOpen) {
        setTimeout(() => $("#installedPaidSearch")?.focus(), 0);
      }
    });
    $("#installedPaidSearch")?.addEventListener("input", () => {
      setLifecyclePickerOpen("installedPaid", true);
      renderInstalledPaidCustomers();
    });
    $("#installedPaidSearch")?.addEventListener("focus", () => {
      setLifecyclePickerOpen("installedPaid", true);
      renderInstalledPaidCustomers();
    });
    $("#installedPaidCascadeMenu")?.addEventListener("click", (event) => {
      const templateButton = event.target.closest("[data-installed-paid-template]");
      if (!templateButton) return;
      event.preventDefault();
      event.stopPropagation();
      installedPaidTemplate = templateButton.dataset.installedPaidTemplate || "search";
      renderInstalledPaidCustomers();
      if (installedPaidTemplate === "search") {
        setTimeout(() => $("#installedPaidSearch")?.focus(), 0);
      }
    });
    $("#installedPaidCascadeMenu")?.addEventListener("change", (event) => {
      const propertyFilter = event.target.closest("#installedPaidPropertyFilter");
      if (propertyFilter) {
        installedPaidFilters.property = propertyFilter.value;
        installedPaidFilters.building = "";
        renderInstalledPaidCustomers();
        return;
      }

      const buildingFilter = event.target.closest("#installedPaidBuildingFilter");
      if (buildingFilter) {
        installedPaidFilters.building = buildingFilter.value;
        renderInstalledPaidCustomers();
      }
    });
    $("#installedPaidList")?.addEventListener("click", (event) => {
      const customerButton = event.target.closest("[data-installed-paid-customer]");
      if (!customerButton) return;
      event.preventDefault();
      event.stopPropagation();
      activeInstalledPaidCustomerId = customerButton.dataset.installedPaidCustomer;
      if ($("#installedPaidSearch")) $("#installedPaidSearch").value = "";
      setLifecyclePickerOpen("installedPaid", false);
      renderInstalledPaidCustomers();
    });
    $("#installedPaidDetail")?.addEventListener("click", (event) => {
      const saveIssueButton = event.target.closest("[data-save-installed-paid-issue]");
      if (saveIssueButton) {
        event.preventDefault();
        event.stopPropagation();
        saveInstalledPaidIssueStatus(saveIssueButton.dataset.saveInstalledPaidIssue);
        return;
      }

      const recordButton = event.target.closest("[data-closed-log]");
      if (!recordButton) return;
      event.preventDefault();
      event.stopPropagation();
      openClosedCustomerRecord(recordButton.dataset.closedLog);
    });
    $("#oldResourceSearchInput").addEventListener("input", (event) => {
      oldResourceFilters.query = event.target.value;
      renderOldResourceOptions($("#oldCustomerSelect").value);
    });
    $("#oldResourceTypeFilter").addEventListener("change", (event) => {
      oldResourceFilters.type = event.target.value;
      oldCustomerCascade.customerId = "";
      if (event.target.value) {
        setContactCategoryValue(currentContactType(), event.target.value);
        if (formEditMode) {
          formHasUserChanges = true;
          scheduleAutosave();
        }
      }
      renderOldResourceOptions();
    });
    $("#oldResourceLevelFilter").addEventListener("change", (event) => {
      oldResourceFilters.level = event.target.value;
      oldCustomerCascade.customerId = "";
      if (event.target.value) {
        setSelectValue("#contactLevelSelect", event.target.value);
        if (formEditMode) {
          formHasUserChanges = true;
          scheduleAutosave();
        }
      }
      renderOldResourceOptions();
    });
    $("#oldCustomerCascadeMenu").addEventListener("input", (event) => {
      const searchInput = event.target.closest("#oldCustomerSearchInput");
      if (!searchInput) return;
      oldCustomerFilters.query = searchInput.value;
      refreshOldCustomerSearchResults();
    });
    $("#oldCustomerCascadeMenu").addEventListener("change", (event) => {
      const propertyFilter = event.target.closest("#oldCustomerPropertyFilter");
      if (propertyFilter) {
        oldCustomerFilters.property = propertyFilter.value;
        oldCustomerFilters.building = "";
        oldCustomerCascade.customerId = "";
        renderOldCustomerOptions();
        return;
      }

      const buildingFilter = event.target.closest("#oldCustomerBuildingFilter");
      if (buildingFilter) {
        oldCustomerFilters.building = buildingFilter.value;
        oldCustomerCascade.customerId = "";
        renderOldCustomerOptions();
      }
    });
    $("#oldCustomerCascadeMenu").addEventListener("click", (event) => {
      const templateButton = event.target.closest("[data-old-template]");
      if (templateButton) {
        oldCustomerTemplate = templateButton.dataset.oldTemplate || "search";
        renderOldCustomerOptions($("#oldCustomerSelect").value);
        if (oldCustomerTemplate === "search") {
          setTimeout(() => $("#oldCustomerSearchInput")?.focus(), 0);
        }
        return;
      }

      const customerButton = event.target.closest("[data-cascade-customer]");
      if (customerButton) {
        oldCustomerCascade.customerId = customerButton.dataset.cascadeCustomer;
        renderOldCustomerOptions(oldCustomerCascade.customerId);
        beginOldCustomerReturn(oldCustomerCascade.customerId);
        $("#oldCustomerCascadeMenu").classList.add("is-hidden");
        $("#oldCustomerCascadeButton").setAttribute("aria-expanded", "false");
      }
    });
    $("#customerTrackerFilter").addEventListener("change", () => {
      activeCustomerKey = "";
      renderCustomerTracker();
    });
    $("#customerTrackerSearch").addEventListener("input", renderCustomerTracker);
    $("#customerTrackerSummary").addEventListener("click", (event) => {
      const button = event.target.closest("[data-customer-filter]");
      if (!button) return;
      $("#customerTrackerFilter").value = button.dataset.customerFilter;
      activeCustomerKey = "";
      renderCustomerTracker();
    });
    $("#customerTrackerList").addEventListener("click", (event) => {
      const card = event.target.closest("[data-customer-key]");
      if (!card) return;
      activeCustomerKey = card.dataset.customerKey;
      renderCustomerTracker();
    });
    $("#customerTrackerDetail").addEventListener("click", (event) => {
      const returnButton = event.target.closest("[data-start-return]");
      if (returnButton) {
        startReturnVisitFromCustomer(returnButton.dataset.startReturn);
        return;
      }

      const invalidButton = event.target.closest("[data-request-invalid]");
      if (invalidButton) {
        requestInvalidCustomer(invalidButton.dataset.requestInvalid);
        return;
      }

      const closeCustomerButton = event.target.closest("[data-close-customer]");
      if (closeCustomerButton) {
        markOldCustomerClosed(closeCustomerButton.dataset.closeCustomer);
      }
    });

    $("#liveFeed").addEventListener("click", (event) => {
      const wechatButton = event.target.closest("[data-wechat-log]");
      if (wechatButton) {
        openWechatProof(wechatButton.dataset.wechatLog);
        return;
      }

      const logDetailButton = event.target.closest("[data-log-detail]");
      if (logDetailButton) {
        openLogFieldDetail(logDetailButton.dataset.logId, logDetailButton.dataset.logDetail);
      }
    });
    $("#warningList").addEventListener("click", (event) => {
      const reviewButton = event.target.closest("[data-review-invalid]");
      if (reviewButton) {
        reviewInvalidCustomer(reviewButton.dataset.reviewInvalid, reviewButton.dataset.invalidAction);
        return;
      }

      const orderChangeButton = event.target.closest("[data-review-order-change]");
      if (orderChangeButton) {
        reviewOrderChangeRequest(orderChangeButton.dataset.reviewOrderChange, orderChangeButton.dataset.orderChangeAction);
      }
    });

    $("#autoRefresh").addEventListener("change", (event) => {
      if (event.target.checked) {
        startAutoRefresh();
        showToast("自动刷新已开启");
      } else {
        clearInterval(refreshTimer);
        showToast("自动刷新已暂停");
      }
    });

    $("#logForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!formEditMode) {
        promptStartFormEdit();
        return;
      }
      const scrollPosition = currentWindowScrollPosition();
      clearTimeout(autosaveTimer);
      suppressAutosave = true;
      const submittedDraftId = activeDraftId;
      const submittedMode = editableVisitMode(currentVisitMode());
      const payload = readFormPayload(activeDraft() || {});
      if (!validateContactMethodBeforeSubmit(payload)) {
        suppressAutosave = false;
        return;
      }
      if (!validateWechatNicknameBeforeSubmit(payload)) {
        suppressAutosave = false;
        return;
      }
      if (!validateIdentityBeforeSubmit(payload)) {
        suppressAutosave = false;
        return;
      }
      const shouldCloseCustomerAfterSubmit = payload.wechatStage === "已成交" && payload.contactType === "customer";
      if (shouldCloseCustomerAfterSubmit && !window.confirm(`提交后会把“${payload.customer || "该客户"}”转入已成交区，并从老客户回访名单移走。\n\n确认已成交并提交吗？`)) {
        suppressAutosave = false;
        return;
      }
      const submittedLog = {
        id: `log-${Date.now()}`,
        visitType: payload.visitType,
        oldCustomerLogId: payload.oldCustomerLogId,
        contactType: payload.contactType,
        employeeId: payload.employeeId,
        storeResult: payload.storeResult,
        storeContactStatus: payload.storeContactStatus,
        storeAnonymous: payload.storeAnonymous,
        timestamp: new Date().toISOString(),
        property: payload.property,
        buildingNumber: payload.buildingNumber,
        unit: payload.unit,
        building: payload.building,
        room: payload.room,
        customer: payload.customer,
        phone: payload.phone,
        reception: payload.reception,
        receptionOther: payload.receptionOther,
        result: payload.result,
        customerType: payload.customerType,
        contactLevel: payload.contactLevel,
        wechatAdded: payload.wechatAdded,
        wechatName: payload.wechatName,
        wechatFileName: payload.wechatFileName,
        wechatFileNames: payload.wechatFileNames,
        wechatAvatarFileName: payload.wechatAvatarFileName,
        wechatHomepageFingerprint: payload.wechatHomepageFingerprint,
        wechatNameSource: payload.wechatNameSource,
        wechatStage: payload.wechatStage,
        floor: payload.floor,
        location: payload.location,
        locationSource: payload.locationSource,
        photos: payload.photos,
        photoNames: payload.photoNames,
        duration: payload.duration,
        durationSource: payload.durationSource,
        note: payload.note,
        status: "submitted",
        locked: true,
        draftId: submittedDraftId || ""
      };

      if ((payload.wechatFileNames && payload.wechatFileNames.length) || payload.wechatAvatarFileName || payload.wechatName) {
        const employee = getEmployee(submittedLog.employeeId);
        submittedLog.wechatProof = {
          isSample: false,
          fileName: payload.wechatFileName || payload.wechatAvatarFileName || "未上传截图文件",
          fileNames: payload.wechatFileNames || [],
          avatarFileName: payload.wechatAvatarFileName || "",
          homepageFingerprint: payload.wechatHomepageFingerprint || "",
          uploadTime: submittedLog.timestamp,
          customerWechat: payload.wechatName || `${submittedLog.customer} · 微信客户`,
          stage: payload.wechatStage || submittedLog.result,
          summary: submittedLog.note || "员工上传了微信聊天截图，等待老板查看跟进内容。",
          nextStep: "根据聊天内容安排回访或邀约到店。",
          messages: [
            { from: "staff", text: `${employee.name}已添加客户微信并上传聊天截图。`, time: formatTime(submittedLog.timestamp) },
            { from: "customer", text: submittedLog.note || "客户需求见拜访纪要。", time: formatTime(submittedLog.timestamp) }
          ]
        };
      }

      const sourceMergeResult = mergeSubmittedLogIntoSource(submittedLog);
      if (submittedDraftId) {
        state.drafts = state.drafts.filter((draft) => draft.id !== submittedDraftId);
      }
      activeDraftId = "";
      addLog(submittedLog);
      if (shouldCloseCustomerAfterSubmit) {
        if (closeCustomerFromLog(submittedLog, { confirm: false, toast: false })) {
          saveState();
        }
      }
      const lifecycleSyncResult = submittedLog.contactType === "customer" ? syncCustomerLifecycleFromLog(submittedLog) : null;
      if (lifecycleSyncResult?.changed) {
        saveState();
        renderAll();
      }
      suppressAutosave = false;
      draftTrayNotice = "刚才这条日志已提交并锁定，当前表单已清空。下面只是其他还没提交的草稿。";
      const submitLabel = submittedLog.visitType === "门店接待" ? "门店接待" : "日志";
      const targetMode = postSubmitTargetMode(submittedMode, payload);
      resetFormForBlankEntry(`${submitLabel}已提交，当前表单已清空。${postSubmitTargetMessage(targetMode, submittedMode)}`, {
        editing: false,
        level: "success",
        mode: targetMode,
        submittedMode,
        contactType: payload.contactType,
        customerType: payload.customerType,
        contactLevel: payload.contactLevel,
        preserveScroll: true,
        scrollPosition
      });
      if (lifecycleSyncResult?.changed) {
        showToast(`${submitLabel}已提交，${lifecycleSyncResult.stage}已联动${lifecycleSyncResult.logs + lifecycleSyncResult.records}条客户资料`);
      } else if (sourceMergeResult.changed) {
        showToast(`${submitLabel}已提交，已更新原资料`);
      } else {
        showToast(`${submitLabel}已提交并锁定，员工端不能再修改`);
      }
    });

    $("#logForm").addEventListener("reset", (event) => {
      if (suppressAutosave) return;
      event.preventDefault();
      clearCurrentForm();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".scroll-picker")) {
        closeScrollPickers();
      }
    });

    $("#employeeBoard")?.addEventListener("click", (event) => {
      const draftButton = event.target.closest(".open-draft");
      if (draftButton) {
        event.preventDefault();
        loadDraftToForm(draftButton.dataset.draft, {
          anchorTop: draftButton.getBoundingClientRect().top,
          listScrollTop: draftButton.closest(".draft-quick-list")?.scrollTop || 0,
          scrollPosition: currentWindowScrollPosition()
        });
        return;
      }

      const detailButton = event.target.closest("[data-detail]");
      if (detailButton) {
        openEmployeeDetail(detailButton.dataset.employee, detailButton.dataset.detail, detailButton.dataset.route || "");
        return;
      }

      const quickLogButton = event.target.closest(".quick-log");
      if (!quickLogButton) return;
      startNewLogForEmployee(quickLogButton.dataset.employee);
    });

    $("#staffList").addEventListener("click", (event) => {
      const detailButton = event.target.closest("[data-detail]");
      if (!detailButton) return;
      openEmployeeDetail(detailButton.dataset.employee, detailButton.dataset.detail, detailButton.dataset.route || "");
    });

    $("#detailModal").addEventListener("click", (event) => {
      const wechatButton = event.target.closest("[data-wechat-log]");
      if (wechatButton) {
        openWechatProof(wechatButton.dataset.wechatLog);
        return;
      }

      const logDetailButton = event.target.closest("[data-log-detail]");
      if (logDetailButton) {
        openLogFieldDetail(logDetailButton.dataset.logId, logDetailButton.dataset.logDetail);
        return;
      }

      if (event.target.closest("[data-close-detail]")) {
        closeDetail();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !$("#detailModal").hidden) {
        closeDetail();
      }
    });

    $("#staffForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#newStaffName").value.trim();
      state.employees.push({
        id: `emp-${Date.now()}`,
        name,
        region: $("#newStaffRegion").value,
        target: Number($("#newStaffTarget").value),
        phone: "待录入",
        status: "working",
        map: {
          x: 18 + Math.round(Math.random() * 64),
          y: 18 + Math.round(Math.random() * 64),
          label: $("#newStaffRegion").value
        },
        route: ["待分配路线"]
      });
      saveState();
      renderAll();
      event.target.reset();
      showToast("员工已添加");
    });

    ["photoRule", "minPhotos", "gapMinutes"].forEach((id) => {
      $(`#${id}`).addEventListener("change", applyRuleUpdates);
    });

    $("#resetDemo").addEventListener("click", () => {
      state = normalizeState(buildSeedState());
      saveState();
      renderAll();
      showToast("演示数据已恢复");
    });
  }

  function startAutoRefresh() {
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
      $("#syncState").textContent = `刷新于 ${formatTime(new Date())}`;
      renderWarnings();
      renderMetrics();
    }, 30000);
  }

  function init() {
    $("#workDate").valueAsDate = today;
    renderBuildingOptions();
    renderRoomOptions();
    setRenovationResultValue($("#resultSelect")?.value || "拆改");
    syncStoreReceptionLayout({ clearHidden: false });
    syncAllScrollPickers();
    bindEvents();
    renderAllUploadPreviews();
    syncAllCollapsibleSections();
    normalizeResourceCategoriesForCurrentState();
    renderAll();
    setFormEditMode(false, FORM_LOCK_MESSAGE, "warn");
    switchView("overview");
    startAutoRefresh();
  }

  init();
})();
