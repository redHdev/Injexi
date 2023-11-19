import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { SettingOutlined, LogoutOutlined, DashboardOutlined, LeftOutlined, ReadOutlined } from "@ant-design/icons";
import Link from 'next/link';

const { Header, Content, Footer } = Layout;

function ProtectedLayout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();

  const dropdownItems = [
    {
      key: "1",
      label: "Dashboard",
      icon: <DashboardOutlined style={{ marginRight: '4px' }} />,
      link: "/user/dashboard/",
    },
    {
      key: "4",
      label: "Reviews",
      icon: <ReadOutlined style={{ marginRight: '4px' }} />,
      link: "/user/reviews/",
    },
    {
      key: "2",
      label: "Settings",
      icon: <SettingOutlined style={{ marginRight: '4px' }} />,
      link: "/user/settings/",
    },
    {
      key: "3",
      label: "Log Out",
      icon: <LogoutOutlined style={{ marginRight: '4px' }} />,
    },
  ];

  const menu = [
    {
      key: "1",
      label: <span style={{ color: '#ffffff' }}>Back To Homepage</span>,
      icon: <LeftOutlined style={{ marginRight: '4px' }} />,
      link: "/",
    },
  ];

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            maxWidth: "1200px",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#252525", // Change the background color
            height: "40px", // Change the height
            padding: "10px",
            margin: 0,
          }}
        >
          {/* Left-aligned "Back To Website" Menu */}
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: '8px' }}>
  {menu.map((item) => (
    <Menu.Item key={item.key}>
      <Link href={item.link}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {item.icon}
          {item.label}
        </span>
      </Link>
    </Menu.Item>
  ))}
</Menu>

          {/* Right-aligned dropdown icon menu */}
          
          <Dropdown
            overlay={
              <Menu onClick={(e) => {
                switch (Number(e.key)) {
                  case 1:
                    router.push(dropdownItems.find(item => item.key === "1").link);
                    break;
                  case 2:
                    router.push(dropdownItems.find(item => item.key === "2").link);
                    break;
                  case 3:
                    signOut();
                    break;
                  default:
                    break;
                    case 4:
                          router.push(dropdownItems.find(item => item.key === "4").link);
                          break;
                }
              }}
              >
                {dropdownItems.map((item) => (
                  <Menu.Item key={item.key}>
                    {item.icon}
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Avatar style={{ backgroundColor: "#f64cb7", cursor: "pointer" }}>
              {session?.user?.name?.charAt(0)}
            </Avatar>
          </Dropdown>
        </Header>
        <Content style={{ padding: "0 20px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>Injexi ©2023</Footer>
      </Layout>
    </div>
  );
}

export default ProtectedLayout;
