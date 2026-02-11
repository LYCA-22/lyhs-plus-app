export interface userMemberData {
  uuid: string;
  display_name: string;
  zh_name: string;
  role: "studentMember" | "lysaStaff" | "lyhsTeacher";
  is_disabled: boolean;
  class_name: "忠" | "仁" | "孝" | "愛" | "信" | "義";
  grade: "高一" | "高二" | "高三";
  number: number;
  stu_id: string;
  is_member: boolean;
  ksa_enabled: boolean;
  openid_account: string | null;
  openid_password: string | null;
  created_at: string;
  updated_at: string;
}

// 舊版，待刪除
export interface userData {
  email: string;
  password: string;
  name: string;
  type?: "staff" | "normal";
  level?: string;
  Class: string;
  grade: string;
  role?: string;
}

export interface QuizData {
  question: string;
  answer: string;
  explanation: string;
}

// mailbox
export interface studentData {
  id: string;
  searchCode: string;
  email: string;
  name: string;
  type: string;
  title: string;
  description: string;
  class: string;
  number: string;
  solution: string;
  handler: string;
  status: string;
  createdTime: string;
  updatedTime: string;
}

export enum homeApps {
  eSchool = "eSchool",
  studyHistory = "studyHistory",
  schoolWeb = "schoolWeb",
  mailBox = "mailBox",
  mailSearch = "mailSearch",
  calendar = "calendar",
  repair = "repair",
}

export interface App {
  name: string;
  icon: string;
  onclick?: string;
  link?: string;
  type: "btn" | "link";
  color: string;
  description: string;
}

export interface schemaItem {
  title: string;
  title2?: string;
  description?: string;
  type: "link" | "btn" | "component";
  isOutLink?: boolean;
  href?: string;
  href2?: string;
  access_manage: boolean;
  userCheck?: boolean;
  component?: React.ReactNode;
  icon?: React.ReactNode;
  btnfunction?: string;
  itemIcon: React.ReactNode;
}

export interface ClassList {
  sco4: null;
  clsId: number;
  sco3: null;
  sco6: number;
  hourTot: number;
  sco5: null;
  sco2: null;
  sco1: number;
  stdCname: string;
  stdNo: string;
  hourSum: number;
  credSum: number;
  stdId: number;
  retainM: null;
  id: number;
  seme: number;
  upgrade: string;
  credTot: number;
  subjTot: number;
  subjSum: number;
  credMust: number;
  seat: string;
  stdSemeId: number;
  clsCname: string;
  grade: number;
  syear: number;
  stdSeme1Id: number;
}

// Sentry Error
export class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleFrontendError";
  }
}

export interface creditData {
  aboriginalM: string | null;
  absence1: number | null;
  absence2: number | null;
  absence3: number | null;
  absence4: number | null;
  absence5: number | null;
  absence6: number | null;
  absence7: number | null;
  absence8: number | null;
  absence9: number | null;
  absence10: number | null;
  absence11: number | null;
  absence12: number | null;
  absence13: number | null;
  absence14: number | null;
  absence15: number | null;
  absence16: number | null;
  absence17: number | null;
  absence18: number | null;

  adjustYn: string | null;
  admissionM: string | null;
  authDt: string | null;
  authNo: string | null;
  authNoTest: string | null;
  authTestDt: string | null;
  autobiography: string | null;
  barCode: string | null;
  birthDt: string | null;
  birthplace: string | null;
  birthplaceOth: string | null;
  bloodM: string | null;

  cadre1M: string | null;
  cadre2M: string | null;
  cadre3M: string | null;
  cadreM: string | null;
  cardNo: string | null;
  category: string | null;
  checkYn: string | null;
  chipCode: string | null;
  clanM: string | null;
  clanOther: string | null;

  clsCname: string | null;
  clsId: number | null;
  clsNo: string | null;
  clsTypeM: string | null;
  clsWorkM: string | null;

  cntAddr: string | null;
  cntArea: string | null;
  cntCity: string | null;
  cntTel1: string | null;
  cntTel2: string | null;
  cntTown: string | null;
  cntZip: string | null;

  colonyId: string | null;
  constellation: string | null;

  counselPublicYn: string | null;
  counselor1Id: string | null;
  counselor2Id: string | null;
  counselorId: string | null;
  counselorNote: string | null;

  countYn: string | null;
  countryId: string | null;

  credAdd: string | null | number;
  credAddElect: string | null | number;
  credAddElectSrc: string | null | number;
  credAddMust: string | null | number;
  credAddMustSrc: string | null | number;
  credAddSrc: string | null | number;
  credCent: string | null | number;
  credCentSum: string | null | number;
  credElect: number | null | number;
  credElectSrc: string | null | number;
  credMust: number | null | number;
  credMustSrc: string | null | number;
  credSum: string | null | number;
  credSumElect: number | null | number;
  credSumMust: number | null | number;
  credTot: string | null | number;
  credTotSrc: string | null | number;

  demerit1: number | null;
  demerit2: number | null;
  demerit3: number | null;
  demeritYn: string | null;

  deptCname: string | null;
  deptId: number | null;
  deptNo: string | null;

  disabled: string | null;
  disabledIdent: string | null;
  disabledIdentLevel: string | null;
  disabledIdentM: string | null;
  disabledLevel: string | null;

  divsCname: string | null;
  divsId: number | null;
  divsNo: string | null;

  editFirst: string | null;
  editLatest: string | null;
  email: string | null;

  emgArea: string | null;
  emgName: string | null;
  emgRel: string | null;
  emgRelO: string | null;
  emgTel: string | null;

  empId: number | null;

  entArt: number | null;
  entChi: string | null;
  entDt: string | null;
  entEng: string | null;
  entMat: string | null;
  entPr: string | null;
  entSci: string | null;
  entSoc: string | null;
  entSum: string | null;
  entSyear: number | null;

  entitleM: string | null;
  entryM: string | null;
  examNumber: string | null;
  extendYn: string | null;

  familyForm1: string | null;
  familyForm2: string | null;

  feeDt: string | null;
  feeTypeM: string | null;

  gduVrfDt: string | null;
  gduVrfNo: string | null;

  giftedType: string | null;

  graCity: string | null;
  graCredMust: number | null;
  graCredTot: number | null;
  graDt: string | null;
  graLost: string | null;
  graNo: string | null;
  graResultM: string | null;
  graSchool: string | null;
  graSchoolOther: string | null;
  graSco1: number | null;
  graSco2: number | null;
  graSco3: number | null;
  graSco4: number | null;
  graSco5: number | null;
  graSco6: number | null;
  graTrack: string | null;
  graWord: string | null;
  graYear: string | null;
  graYm: string | null;

  grade: number | null;
  group108Id: number | null;
  groupReason: string | null;

  guAliveM: string | null;
  guAppelation: string | null;
  guAppelationM: string | null;
  guArea: string | null;
  guBirthyear: string | null;
  guDisabilityCard: string | null;
  guEducationM: string | null;
  guEmail: string | null;
  guJobM: string | null;
  guJobO: string | null;
  guJobname: string | null;
  guMobile: string | null;
  guName: string | null;
  guNationality: string | null;
  guNationalityKind: string | null;
  guNationalityM: string | null;
  guOarea: string | null;
  guOtel: string | null;
  guRelaM: string | null;
  guTel: string | null;
  guWorkplace: string | null;

  hours: number | null;

  id: string | null;
  idno: string | null;
  idnoM: string | null;

  individualCls: string | null;
  individualDetail: string | null;
  individualSeat: string | null;
  individualType: string | null;

  kindCode1: string | null;
  kindCode2: string | null;

  leaveType: string | null;

  managerId: string | null;

  merit1: number | null;
  merit2: number | null;
  merit3: number | null;

  mobilePhone: string | null;

  newTypeM: string | null;
  newstd: string | null;

  note: string | null;
  notice: string | null;

  nowM: string | null;
  ocst: string | null;
  outYn: string | null;
  outerCardNo: string | null;
  passport: string | null;

  paymentTotal: number | null;
  rank: number | null;

  refundTotal: number | null;
  refundType1: string | null;
  refundType2: string | null;

  regAddr: string | null;
  regArea: string | null;
  regCity: string | null;
  regTel: string | null;
  regTown: string | null;
  regTypeM: string | null;
  regZip: string | null;

  religion: string | null;
  religionOther: string | null;

  remark: string | null;
  residence: string | null;
  residenceDt: string | null;

  schName: string | null;
  schNo: string | null;

  sco1: number | null;
  sco2: number | null;
  sco3: number | null;
  sco4: number | null;
  sco5: number | null;
  sco6: string | null;

  scoTypeM: string | null;

  scoreT: string | null;
  scoreTSrc: string | null;
  scoreVSrc: string | null;

  seat: string | null;
  seme: number | null;
  sexM: string | null;

  sgroup1: string | null;
  siblingRank: string | null;

  staffCardNo: string | null;

  statusM: string | null;

  stdCname: string | null;
  stdEname: string | null;
  stdId: number | null;
  stdNo: string | null;

  studyGroup: string | null;
  syear: number | null;

  tcomm: string | null;
  tcomm1: string | null;
  tcomm2: string | null;
  tcomm3: string | null;

  tendency: string | null;
  tendencyOther: string | null;

  total: number | null;

  typeCode1: string | null;
  typeCode2: string | null;

  unvPath: string | null;
  verifyM: string | null;

  vrfDt: string | null;
}
