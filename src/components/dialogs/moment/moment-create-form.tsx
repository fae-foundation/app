"use client"

import {
  FileText, 
  Loader2,
  Settings, 
  Shield,
  Star,
  Brain,
  Globe,
  Users,
  Hash,
  AlertTriangle,
  Heart,
  Ban,
  Scale,
  Copyright,
  Award,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { image, article , MetadataLicenseType, MetadataAttributeType, MediaImageMimeType } from "@lens-protocol/metadata";
import { uploadFile } from "@/utils/upload-file";
import { useRouter } from "next/navigation"
import { storageClient } from "@/lib/storage-client";
import { post } from "@lens-protocol/client/actions";
import { useLensAuthStore } from "@/stores/auth-store"
import { useWalletClient, usePublicClient, useAccount, useSwitchChain, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { abi } from '@/lib/abi'
import { useAppConfigStore } from "@/stores/app-config-store"
import { useAuthCheck } from "@/hooks/auth/use-auth-check"
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet"
import { toast } from "sonner"
import copy from "copy-to-clipboard";
import { evmAddress} from "@lens-protocol/client";
import { env } from "@/lib/env";

import { Toast } from "@/components/editer/Toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UnifiedEditor } from "@/components/editer/UnifiedEditor"
import { ToggleButton } from "@/components/editer/ToggleButton"
import { ImageUpload } from "@/components/editer/ImageUpload"
import { handleOperationWith } from "@lens-protocol/client/viem"

interface UploadedImage {
  id: string
  name: string
  size: number
  type: string
  url?: string
  file: File
}

interface Tag {
  name: string
}

interface MCreateFormProps {
  onClose: () => void
  onComplete?: () => void
}

const RATING_OPTIONS = [
  {
    value: "general-rate",
    label: "全年龄",
    description: "适合所有年龄段的内容",
    icon: <Star className="h-4 w-4 text-green-500" />,
  },
  {
    value: "teen-rate",
    label: "青少年级",
    description: "可能不适合13岁以下的内容",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  },
  {
    value: "mature-rate",
    label: "成人级",
    description: "包含暴力、色情等内容",
    icon: <Shield className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "explicit-rate",
    label: "限制级",
    description: "包含严重露骨的暴力、色情等内容",
    icon: <Ban className="h-4 w-4 text-red-500" />,
  },
]

const WARNING_OPTIONS = [
  {
    value: "none-warning",
    label: "无内容预警",
    icon: <Shield className="h-4 w-4 text-gray-400" />,
  },
  {
    value: "ai-warning",
    label: "AI生成内容预警",
    icon: <Brain className="h-4 w-4 text-red-500" />,
  },
  {
    value: "violence-warning",
    label: "暴力描述预警",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  {
    value: "death-warning",
    label: "主角死亡预警",
    icon: <Heart className="h-4 w-4 text-red-600" />,
  },
  {
    value: "noncon-warning",
    label: "强制/非自愿预警",
    icon: <Ban className="h-4 w-4 text-red-700" />,
  },
  {
    value: "underage-warning",
    label: "未成年性行为预警",
    icon: <Shield className="h-4 w-4 text-red-700" />,
  },
]

const CATEGORY_OPTIONS = [
  { value: "none-relationship", label: "综合", icon: <Globe className="h-4 w-4 text-zinc-800" /> },
  { value: "gl", label: "GL", icon: <Heart className="h-4 w-4 text-red-500" /> },
  { value: "gb", label: "GB", icon: <Heart className="h-4 w-4 text-red-500" /> },  
  { value: "bl", label: "BL", icon: <Heart className="h-4 w-4 text-red-500" /> },
  { value: "gen-relationship", label: "无CP", icon: <Hash className="h-4 w-4 text-blue-500" /> },
  { value: "multi-relationship", label: "多元", icon: <Users className="h-4 w-4 text-gray-500" /> },
]

export function MCreateForm({ onClose, onComplete }: MCreateFormProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning">("success")

  const [content, setContent] = useState("")
  //const [selectedFile, setSelectedFile] = useState<AttachmentProps[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState("")
  const [images, setImages] = useState<UploadedImage[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedRating, setSelectedRating] = useState("general-rate")
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>(["none-warning"])
  const [selectedCategories, setSelectedCategories] = useState("none-relationship")
  const [showTagSheet, setShowTagSheet] = useState(false)
  const [showLicenseSheet, setShowLicenseSheet] = useState(false)
  const [isEditorExpanded, setIsEditorExpanded] = useState(false)
  //const [addToCollection, setAddToCollection] = useState(false)//合集功能开发中
  //const [language, setLanguage] = useState("zh-CN")
  //const [privacy, setPrivacy] = useState("public")
  //const [commentPermission, setCommentPermission] = useState("all")

  // auth
  const router = useRouter()
  const { sessionClient: client, currentProfile } = useLensAuthStore();
  const { contractAddress, explorerUrl } = useAppConfigStore();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const reconnectWallet = useReconnectWallet();
  const { checkAuthentication } = useAuthCheck();

  // Toast state
  const [showDevelopmentToast, setShowDevelopmentToast] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("请输入标题 ！")
      return
    }

    if (!selectedRating) {
      toast.error("请选择动态分类-分级")
      return
    }

    if (!selectedWarnings) {
      toast.error("请选择动态分类-警告")
      return
    }
    
    if (!selectedCategories) {
      toast.error("请选择动态分类-频道")
      return
    }

    if (!checkAuthentication("发布内容")) {
      return;
    }

    if (!content.trim()) {
    toast.error("请输入内容 ！")
    return
    }

    setIsSubmitting(true)

    try {

      if (!client?.isSessionClient()) {
        throw Error("Failed to get public client");
      }

      //license Metadata
      let licenseValue: string = "";

      let metadata;
      //Get attributes
      const attributes = getPostAttributes();
      function getPostAttributes(): any[] {
        const attributes: any[] = [
          {
            key: "originalDate",
            type: MetadataAttributeType.DATE,
            value: new Date().toISOString(),
          }
        ];
        
        if (licenseValue) {
          attributes.push({
            key: "license",
            type: MetadataAttributeType.STRING,
            value: licenseValue,
          });
        }
        return attributes;
      }

      // Upload image to Grove storage
      let uploadedImages: UploadedImage[] = [];
      if (images && Array.isArray(images) && images.length > 0) {
        try {
          for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image && image.file) {
              const url = await uploadFile(image.file);
              uploadedImages.push({
                ...image,
                url,
              });
            }
          }
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error("Failed to upload images. Please try again.")
          return;
        }
      }

      //Build tags
      const allTags = [...(tags || []).map(tag => tag.name)];
      
      // 添加moment标签
      allTags.push("moment");
      // 添加分级
      if (selectedRating) {
        allTags.push(selectedRating);
      }
      // 添加频道
      if (selectedCategories) {
        allTags.push(selectedCategories);
      }
      // 添加警告
      (selectedWarnings || []).forEach(warning => {
        if (warning) {
          allTags.push(warning);
        }
      });

      //Create Metadata
      if (!images || images.length === 0 || !uploadedImages || uploadedImages.length === 0) {
        metadata = article({
          title,
          content,          
          attributes,
          tags: allTags,
        })
      } 
      else {
        metadata = article({
          title,
          content,
          attachments: (uploadedImages || []).map(i => ({
            item: i.url!,
            type: i.type as MediaImageMimeType,
          })),
          attributes,
          tags: allTags,
        })
      }

      // Upload metadata to storage and create post via Lens Protocol SDK
      const { uri } = await storageClient.uploadAsJson(metadata);
 
      //const feed = await getFeedAddress(lens, currentProfile?.address);

      //const actions = getPostActions(collectingSettings, address);

      await post(client, {
        contentUri: uri,
        feed: evmAddress(env.NEXT_PUBLIC_MOMENT_ADDRESS)
        //actions,
      })
      .andThen(handleOperationWith(walletClient))
      .andTee((v) => {
        console.log(v);
      })
      .andThen(client.waitForTransaction);
      
      router.push("/feed");
      toast.success("Success!", {
        description: `View on the feed now!`
      })
      if (onComplete) {
        onComplete()
      } else {
        onClose()
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseToast = () => {
    setShowToast(false)
  }

  return (
    <div className="h-full overflow-y-auto">
      <Toast
        message={toastMessage}
        show={showToast}
        type={toastType}
        duration={1000}
        onClose={handleCloseToast}
      />

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg text-zinc-900 font-semibold">
            <FileText className="h-5 w-5" />
            <span>动态</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Unified Editor */}
            <div className="space-y-4">
              <UnifiedEditor
                title={title}
                onTitleChange={setTitle}
                content={content}
                onContentChange={setContent}
                tags={tags}
                onTagsChange={setTags}
                isExpanded={isEditorExpanded}
                onExpandedChange={setIsEditorExpanded}
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <ImageUpload images={images} onImagesChange={setImages} maxImages={12} required={false} />
            </div>

            {/* Content Classification Dialog */}
            <Dialog open={showTagSheet} onOpenChange={setShowTagSheet}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={`
                    w-full h-14 rounded-2xl
                    bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50
                    border-spacing-2 border-transparent
                    transition-all duration-200
                    //hover:shadow-lg
                    hover:border-zinc-300
                    active:scale-95
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
                    group
                  `}
                >
                  <div className="flex items-center gap-1">
                    <div className="p-2 rounded-lg group-hover:bg-purple-50 transition-colors">
                      <Settings className="h-5 w-5 text-zinc-700 group-hover:rotate-180 transition-transform " />
                    </div>
                    <div className="flex gap-1 text-sm font-medium text-zinc-700">
                      动态分类<div className="text-destructive">*</div>
                    </div>
                  </div>
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[85vh] bg-white" style={{ zIndex: 1000 }}>
                <DialogHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Settings className="h-4 w-4 text-zinc-900" />
                    <DialogTitle className="text-l font-semibold text-gray-800 text-center">动态分类</DialogTitle>
                  </div>
                </DialogHeader>

                <div className=
                "pt-7 pb-7 overflow-y-auto max-h-[calc(85vh-180px)] grid grid-cols-1 sm:grid-cols-3 gap-x-5">
                  
                  {/* Category Section */}
                  <Card className="border-2 border-zinc-100 bg-zinc-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-zinc-100 rounded-lg">
                          <Globe className="h-4 w-4 text-sky-600" />
                        </div>
                        <h3 className="flex gap-1 text-base font-semibold text-zinc-800">频道<div className="text-destructive">*</div></h3>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                        {CATEGORY_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {setSelectedCategories(option.value)}}
                            className=
                            {`
                              p-3 rounded-lg border-2 transition-all duration-200 text-center
                              ${
                                selectedCategories === option.value
                                  ? "bg-zinc-50 border-zinc-400 shadow-md"
                                  : "bg-white border-gray-200 hover:border-zinc-200 hover:bg-zinc-50"
                              }
                            `}
                            >
                            <div className="flex flex-col items-center justify-center h-full gap-1">
                              {option.icon}
                              <span className="font-medium text-sm">{option.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rating Section */}
                  <Card className="border-2 border-zinc-100 bg-zinc-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-zinc-100 rounded-lg">
                          <Star className="h-4 w-4 text-green-600" />
                        </div>
                        <h3 className="flex gap-1 text-base font-semibold text-zinc-800">分级<div className="text-destructive">*</div></h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {RATING_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedRating(option.value)}
                            className=
                            {`
                              p-3 rounded-lg border-2 transition-all duration-200 text-left
                              ${
                                selectedRating === option.value
                                  ? "bg-zinc-50 border-zinc-400 shadow-md"
                                  : "bg-white border-gray-200 hover:border-zinc-200 hover:bg-zinc-50"
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {option.icon}
                              <span className="font-medium text-sm">{option.label}</span>
                            </div>
                            <p className="text-xs text-gray-600">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Warning Section */}
                  <Card className="border-2 border-zinc-100 bg-zinc-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-zinc-100 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        </div>
                        <h3 className="flex gap-1 text-base font-semibold text-zinc-800">预警<div className="text-destructive">*</div></h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {WARNING_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              if (selectedWarnings.includes(option.value)) {
                                setSelectedWarnings((prev) => prev.filter((w) => w !== option.value))
                              } else {
                                setSelectedWarnings((prev) => [...prev, option.value])
                              }
                            }}
                            className={`
                              p-3 rounded-lg border-2 transition-all duration-200 text-left
                              ${
                                selectedWarnings.includes(option.value)
                                  ? "bg-zinc-100 border-zinc-400 shadow-md"
                                  : "bg-white border-gray-200 hover:border-zinc-200 hover:bg-zinc-50"
                              }
                            `}
                            >
                            <div className="flex items-center gap-2">
                              {option.icon}
                              <span className="font-medium text-sm">{option.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-6 pt-4 bg-white border-t border-gray-200">
                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" 
                    onClick={() => {
                      setSelectedRating("")
                      setSelectedWarnings([])
                      setSelectedCategories("")
                    }} className="px-6">
                      重置
                    </Button>
                  </div>
                </div>

              </DialogContent>
            </Dialog>
           
            <div className="flex justify-end space-x-4">
               {/* Clear Button */}
               <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTitle("")
                  setContent("")
                  setImages([])
                  setTags([])
                  setSelectedRating("")
                  setSelectedWarnings([])
                  setSelectedCategories("")
                }}
              >
                Clear
              </Button>

              {/* Publish Button */}
              <Button disabled={isSubmitting} className="chip-button" >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
