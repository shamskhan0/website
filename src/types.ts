export interface FeatureItem {
  id: string
  icon: string
  title: string
  text: string
  image: string
}

export interface NewsItem {
  id: string
  date: string
  title: string
  text: string
  tag: string
  color: string
  imageUrl?: string
  featured?: boolean
  readTime?: string
  author?: string
  highlights?: string[]
  ctaText?: string
}

export interface ApkVersion {
  id: string
  version: string
  build: number
  releaseDate: string
  size: string
  status: 'LIVE' | 'ARCHIVED' | 'BETA'
  minAndroid: string
  downloads: number
  sha256: string
  changelog: string[]
  downloadUrl: string
}

export interface SiteSettings {
  announcementText: string
  announcementActive: boolean
  heroTitle: string
  heroSubtitle: string
  supportEmail: string
  telegramLink: string
  apkDownloadUrl: string
  maintenanceMode: boolean
}
