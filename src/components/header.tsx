"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Menu, X, Sun, Moon, Monitor, Languages, Wallet, Info, Home, Compass, ScrollText, Plus, MessageSquare } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { usePathname, useRouter } from "next/navigation";
import { useLensAuthStore } from "@/stores/auth-store";
import { ConnectKitButton } from "connectkit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfileSelectStore } from "@/stores/profile-select-store";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet";
import { UploadDialog } from "./dialogs/upload/upload-dialog";
import { UserName } from "./user/user-name";
import { UserUsername } from "./user/user-handle";
import { 
  AppShell,
  Container, 
  Group, 
  Button as MantineButton, 
  Burger, 
  Drawer,
  Stack,
  Text,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

export default function Header() {
  const t = useTranslations("header");
  const navT = useTranslations("navigation");
  const { disconnect: disconnectWallet } = useDisconnect();
  const { currentProfile, setCurrentProfile, sessionClient, setSessionClient } =
    useLensAuthStore();
  const router = useRouter();
  const { address, isConnected, isConnecting, status } = useAccount();
  const { setProfileSelectModalOpen } = useProfileSelectStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [uploadDialogOpened, setUploadDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const intlRouter = useIntlRouter();
  const reconnectWallet = useReconnectWallet();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [walletOpened, { toggle: toggleWallet, close: closeWallet }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // TODO: fix this
  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale prefix from pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
    // Navigate to the new locale path
    intlRouter.push(pathWithoutLocale, { locale: newLocale });
  };

  useEffect(() => {
    // handle wagmi wallet connect error
    if (address && !isConnected && isConnecting) {
      disconnectWallet();
    }
  }, [address, isConnected, isConnecting]);

  // Auto-open profile select modal when wallet is connected but no profile is selected
  useEffect(() => {
    if (isConnected && address && !currentProfile) {
      setProfileSelectModalOpen(true);
    }
  }, [isConnected, address, currentProfile, setProfileSelectModalOpen]);

  const navItems = [
    { href: "/", label: navT("feed"), icon: Home },
    //{ href: '/discover', label: navT('discover'), icon: Compass },
    //{ href: "/what-is-chip", label: navT("onchainProof"), icon: ScrollText },
    { href: "/about", label: navT("home"), icon: Info },
  ];

  const handleDisconnect = async () => {
    disconnectWallet();
    await sessionClient?.logout();
    setCurrentProfile(null);
    setSessionClient(null);
  };

  const handleUploadButtonClick = (action: string) => {
    setSelectedAction(action);
    if (action === "Cook Work") {
      setUploadDialogOpened(false);
      router.push("/create");
    }
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpened(false);
    setSelectedAction(null);
  };

  return (
    <AppShell
      header={isDesktop ? { height: '100vh' } : undefined}
      footer={!isDesktop ? { height: 50 } : undefined}
      navbar={isDesktop ? { width: 64, breakpoint: 'md', collapsed: { mobile: true } } : undefined}
      padding="md"
    >
      {/* Desktop Header with Mantine AppShell */}
      {isDesktop && (
        <AppShell.Header 
          className="fixed left-0 top-0 bottom-auto w-16 h-screen border-r border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-900 dark:border-gray-800 shadow-sm z-10"
          style={{ height: '100vh' }}
        >
          <Container size="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '100%', padding: '2rem 0.25rem' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <img src="/icon0.svg" alt="Arctica" className="h-10 w-10" />
            </Link>
            
            {/* Desktop Navigation*/}
            <nav className="flex flex-col items-center space-y-4 mb-6">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center justify-center w-10 h-10 font-medium transition-colors text-gray-600 hover:text-orange-600 cursor-pointer dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isActive ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" : ""
                    }`}
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
              {currentProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9 border-2 border-gray-200">
                        <AvatarImage
                          src={currentProfile?.metadata?.picture || "/gull.jpg"}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {currentProfile?.username?.localName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 border-gray-200"
                    align="start"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium dark:text-neutral-100 text-gray-800">
                          @{currentProfile?.username?.localName || t("anonymous")}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground dark:text-neutral-400">
                          {currentProfile?.metadata?.bio || t("fanworkLover")}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={() => {
                        reconnectWallet();
                      }}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Address</span>
                    </DropdownMenuItem> 
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {navT("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/settings"
                        className="text-gray-700 hover:text-gray-900"
                        style={{
                          cursor: 'not-allowed',
                          opacity: 0.5,
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {t("settings")} ({t("developing")})
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={handleDisconnect}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("disconnect")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full shrink-0"
                    >
                      <UserAvatar />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="start" forceMount>
                    <DropdownMenuItem
                      onClick={() => {
                        setProfileSelectModalOpen(true);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("selectProfile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => disconnectWallet()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("logOut")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => {
                    return (
                      <Button
                        onClick={show}
                        variant="ghost" 
                        size="icon" 
                        className={`flex items-center justify-center w-10 h-10 font-medium transition-colors text-gray-600 cursor-pointer dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                          hover:text-orange-600 dark:hover:bg-orange-900/20 [&_svg]:!w-5 [&_svg]:!h-5
                        `}
                      >
                      <Wallet/>
                      </Button>
                    );
                  }}
                </ConnectKitButton.Custom>
              )}

              {/* 发布按钮 */}
              <Button
                variant="default"
                size="icon"
                className="w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                onClick={() => setUploadDialogOpened(true)}
                title="发布内容"
              >
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </Button>
            </nav>
            
            {/* User Actions */}
            <div className="flex flex-col items-center space-y-2 mt-auto">
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    {theme === "light" ? (
                      <Sun className="h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Monitor className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-40">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={false}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10"
                  >
                    <Languages className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-32" >
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange("zh")}
                  >
                    <span>中文</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange("en")}
                  >
                    <span>English</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Feedback Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => {
                  if (window.Tally) {
                    window.Tally.openPopup('mKba9z', {
                      layout: 'modal',
                      width: 700,
                      emoji: {
                        text: '👋',
                        animation: 'wave'
                      },
                      onOpen: () => {
                        console.log('反馈表单已打开');
                      },
                      onSubmit: (payload) => {
                        console.log('反馈已提交:', payload);
                      }
                    });
                  } else {
                    // 备用方案：如果 Tally 未加载，使用外部链接
                    window.open('https://tally.so/r/mKba9z', '_blank');
                  }
                }}
                title="反馈"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>

            </div>
          </Container>
        </AppShell.Header>
      )}

      {/* Mobile Footer with Mantine AppShell */}
      {!isDesktop && (
        <AppShell.Footer 
          className="border-t border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-900 dark:border-gray-800 shadow-sm"
        >
          <Container size="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            {/* 汉堡菜单按钮 - 靠左 */}
            <Burger 
              opened={opened} 
              onClick={toggle} 
              size="sm"
              color="gray"
            />

            {/* 导航按钮组 - 居中 */}
            <Group gap="lg" style={{ justifyContent: 'center', alignItems: 'center' }}>
              {/* 主页按钮 */}
              <MantineButton
                variant={pathname === "/" ? "filled" : "outline"}
                color={pathname === "/" ? "orange" : "gray"}
                size="xs"
                component={Link}
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full w-10 h-10 flex items-center justify-center"
              >
                <Home className="h-6 w-6" />
              </MantineButton>

              {/* 发布按钮 */}
              <MantineButton
                variant="outline"
                color="gray"
                size="xs"
                onClick={() => {
                  setUploadDialogOpened(true);
                  setIsMobileMenuOpen(false);
                }}
                className="rounded-full w-10 h-10 flex items-center justify-center"
              >
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </MantineButton>

              {/* 钱包按钮 */}
              {currentProfile ? (
                <MantineButton
                  variant="outline"
                  color="gray"
                  size="xs"
                  className="rounded-full w-10 h-10 flex items-center justify-center p-0"
                  onClick={toggleWallet}
                >
                  <Avatar className="h-10 w-10 border-2 border-gray-200">
                    <AvatarImage
                      src={currentProfile?.metadata?.picture || "/gull.jpg"}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {currentProfile?.username?.localName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </MantineButton>
              ) : isConnected ? (
                <MantineButton
                  variant="outline"
                  color="gray"
                  size="xs"
                  className="rounded-full w-10 h-10 flex items-center justify-center"
                  onClick={() => {
                    setProfileSelectModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="h-6 w-6" />
                </MantineButton>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <MantineButton
                      variant="outline"
                      color="gray"
                      size="xs"
                      className="rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={show}
                    >
                      <Wallet className="h-6 w-6" />
                    </MantineButton>
                  )}
                </ConnectKitButton.Custom>
              )}
            </Group>

            {/* 占位元素 - 保持汉堡按钮居中 */}
            <div style={{ width: '24px' }}></div>
          </Container>
        </AppShell.Footer>
      )}

        {/* 移动端抽屉菜单 */}
        {!isDesktop && (
          <Drawer 
            opened={opened} 
            onClose={close} 
            size="25%" 
            padding="md"
            position="bottom"
            withCloseButton={false}
            styles={{
              content: {
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }
            }}
          >
            <Stack gap="md">
              <Text size="md" fw={600} ta="center">设置</Text>

              {/* 主题和语言切换 */}
              <Group justify="space-between" mt="md" pt="md" style={{ borderTop: '1px solid #e9ecef' }}>
                {/* 主题切换 */}
                <Group gap="xs">
                  <Text size="sm" c="dimmed">主题:</Text>
                  <Group gap="xs">
                    <ActionIcon
                      variant={theme === "light" ? "filled" : "outline"}
                      color={theme === "light" ? "orange" : "gray"}
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon
                      variant={theme === "dark" ? "filled" : "outline"}
                      color={theme === "dark" ? "orange" : "gray"}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon
                      variant={theme === "system" ? "filled" : "outline"}
                      color={theme === "system" ? "orange" : "gray"}
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-4 w-4" />
                    </ActionIcon>
                  </Group>
                </Group>

                {/* 语言切换 */}
                <Group gap="xs">
                  <Text size="sm" c="dimmed">语言:</Text>
                  <Group gap="xs">
                    <MantineButton
                      variant={locale === "zh" ? "filled" : "outline"}
                      color={locale === "zh" ? "orange" : "gray"}
                      size="xs"
                      onClick={() => {
                        handleLanguageChange("zh");
                        close();
                      }}
                    >
                      中
                    </MantineButton>
                    <MantineButton
                      variant={locale === "en" ? "filled" : "outline"}
                      color={locale === "en" ? "orange" : "gray"}
                      size="xs"
                      onClick={() => {
                        handleLanguageChange("en");
                        close();
                      }}
                    >
                      EN
                    </MantineButton>
                  </Group>
                </Group>
              </Group>

              {/* 关于按钮 */}
              <MantineButton
                variant={pathname === "/about" ? "filled" : "subtle"}
                color={pathname === "/about" ? "orange" : "gray"}
                size="sm"
                component={Link}
                href="/about"
                leftSection={<Info className="h-4 w-4" />}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navT("home")}
              </MantineButton>

              {/* 反馈按钮 */}
              <MantineButton
                variant="subtle"
                color="gray"
                size="sm"
                leftSection={<MessageSquare className="h-4 w-4" />}
                onClick={() => {
                  if (window.Tally) {
                    window.Tally.openPopup('mKba9z', {
                      layout: 'modal',
                      width: 700,
                      emoji: {
                        text: '👋',
                        animation: 'wave'
                      },
                      onOpen: () => {
                        console.log('反馈表单已打开');
                        setIsMobileMenuOpen(false);
                      },
                      onSubmit: (payload) => {
                        console.log('反馈已提交:', payload);
                      }
                    });
                  } else {
                    // 备用方案：如果 Tally 未加载，使用外部链接
                    window.open('https://tally.so/r/mKba9z', '_blank');
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                反馈
              </MantineButton>
            </Stack>
          </Drawer>
        )}

        {/* 钱包抽屉菜单 */}
        {!isDesktop && currentProfile && (
          <Drawer 
            opened={walletOpened} 
            onClose={closeWallet} 
            size="47%" 
            padding="md"
            position="bottom"
            withCloseButton={false}
            styles={{
              content: {
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }
            }}
          >
            <Stack gap="md">
              <Text size="md" fw={600} ta="center">Menu</Text>

              {/* 用户信息 */}
              <Group justify="center" mt="md" pt="md" style={{ borderTop: '1px solid #e9ecef' }}>
                <Link 
                  href="/profile" 
                  onClick={() => closeWallet()}
                  className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-0 transition-colors"
                >
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarImage
                      src={currentProfile?.metadata?.picture || "/gull.jpg"}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {currentProfile?.username?.localName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <UserName 
                      account={currentProfile} 
                      className="text-lg font-semibold"
                    />
                    <UserUsername 
                      account={currentProfile} 
                      className="text-sm text-gray-500"
                    />
                    <Text size="sm" c="dimmed" className="max-w-[200px] truncate">
                      {currentProfile?.metadata?.bio || t("fanworkLover")}
                    </Text>
                  </div>
                </Link>
              </Group>

              {/* 菜单选项 */}
              <Stack gap="xs" mt="md">
                <MantineButton
                  variant="subtle"
                  color="gray"
                  size="sm"
                  leftSection={<User className="h-4 w-4" />}
                  component={Link}
                  href="/profile"
                  onClick={() => closeWallet()}
                >
                  {navT("profile")}
                </MantineButton>
                
                <MantineButton
                  variant="subtle"
                  color="gray"
                  size="sm"
                  leftSection={<Wallet className="h-4 w-4" />}
                  onClick={() => {
                    reconnectWallet();
                    closeWallet();
                  }}
                >
                  Address
                </MantineButton>

                <MantineButton
                  variant="subtle"
                  color="gray"
                  size="sm"
                  leftSection={<Settings className="h-4 w-4" />}
                  component={Link}
                  href="/settings"
                  style={{
                    cursor: 'not-allowed',
                    opacity: 0.5,
                  }}
                  onClick={() => closeWallet()}
                >
                  {t("settings")} ({t("developing")})
                </MantineButton>

                <MantineButton
                  variant="subtle"
                  color="red"
                  size="sm"
                  leftSection={<LogOut className="h-4 w-4" />}
                  onClick={() => {
                    handleDisconnect();
                    closeWallet();
                  }}
                >
                  {t("disconnect")}
                </MantineButton>
              </Stack>
            </Stack>
          </Drawer>
        )}
      
      <UploadDialog
        opened={uploadDialogOpened}
        onClose={handleUploadDialogClose}
        onButtonClick={handleUploadButtonClick}
        selectedAction={selectedAction}
      />
    </AppShell>
  );
}
