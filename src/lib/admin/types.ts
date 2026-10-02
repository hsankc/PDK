export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "datetime"
  | "image"
  | "images"
  | "location"
  | "select"
  | "relation"
  | "richtext"
  | "slug"
  | "boolean"
  | "url"
  | "email"
  | "tel"
  | "stats";

export type Option = { value: string; label: string };

export type LatLng = { lat: number; lng: number };

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: Option[];
  rows?: number;
  defaultValue?: unknown;
  /** Geniş ekranda yarım genişlik */
  half?: boolean;
  /** location: enlem/boylamın yazılacağı iki sütun (verilmezse değer {lat,lng} nesnesi olarak saklanır) */
  latField?: string;
  lngField?: string;
  /** number: adım ve sınırlar (örn. kuruş için step 0.01) */
  step?: number;
  min?: number;
  max?: number;
  /** relation: başka tablodan seçim (örn. veteriner); seçenekler sayfa açılırken çekilir */
  relation?: { table: string; labelField: string };
  /** slug: boş bırakılırsa bu alandan (örn. başlık) otomatik üretilir */
  slugFrom?: string;
  /** Boş bırakılırsa veritabanına hiç gönderilmez; sütunun varsayılanı (örn. now()) kullanılır */
  keepDefaultWhenEmpty?: boolean;
}

/** boolean: yayında değilse "Gizli" gösterir · flag: doğruysa sütun adını rozet olarak gösterir */
export type ColumnType = "text" | "image" | "date" | "datetime" | "money" | "status" | "boolean" | "flag";

export interface Column {
  /** Bağlı tablodan değer için nokta kullanılır: "vets.name" (resource.listSelect ile birlikte) */
  name: string;
  label: string;
  type?: ColumnType;
}

export type ResourceIcon =
  | "users"
  | "calendar"
  | "id-card"
  | "message"
  | "heart"
  | "hand-heart"
  | "heart-pulse"
  | "stethoscope"
  | "map-pin"
  | "wallet"
  | "list-checks"
  | "folder-kanban"
  | "scissors"
  | "pen"
  | "book-open"
  | "search"
  | "megaphone"
  | "hand-helping";

export interface ResourceConfig {
  /** Panel adresi: /yonetim/<slug> */
  slug: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  icon: ResourceIcon;
  /** Kenar menüdeki grup başlığı */
  group: string;
  /** content: panelden eklenen içerik · inbox: sitedeki formlardan gelen kayıtlar */
  kind: "content" | "inbox";
  orderBy: { column: string; ascending: boolean }[];
  /** Listede kullanılacak select (varsayılan "*"); bağlı tablo için örn. "*, vets(name)" */
  listSelect?: string;
  titleField: string;
  columns: Column[];
  fields: Field[];
  /** inbox kayıtları için durum alanı */
  status?: {
    field: string;
    options: Option[];
    newValue: string;
    /** Kayıt panelde açılınca otomatik geçilecek durum (örn. "okundu") */
    openedValue?: string;
  };
  /** Sitede görüneceği adres (panelden "sitede gör" bağlantısı için) */
  publicPath?: string;
  /** Aynı tabloyu paylaşan bölümler için sabit sütun değerleri (örn. { kind: "rehber" }).
   *  Liste bu değerlere göre süzülür, yeni kayıtlara otomatik yazılır. */
  fixed?: Record<string, string>;
  /** inbox: kaydı başka bir bölümde taslak içeriğe dönüştüren düğme */
  convert?: {
    /** Hedef bölümün slug'ı */
    to: string;
    label: string;
    /** hedef sütun → kaynak sütun (dizi verilirse dolu olanlar " · " ile birleştirilir) */
    map: Record<string, string | string[]>;
    /** Dönüştürülünce kaynağın alacağı durum */
    setStatus: string;
  };
}

export interface SettingsGroup {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}
