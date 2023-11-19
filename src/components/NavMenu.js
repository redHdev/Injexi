import React from 'react';
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { SettingOutlined, LogoutOutlined, DashboardOutlined, ReadOutlined } from "@ant-design/icons";

const { Header } = Layout;

function NavMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = router.pathname;

  // Don't show NavMenu on these paths
  const excludedPaths = ["/user/dashboard", "/user/settings", "/user/reviews"];

  if (excludedPaths.includes(currentPath)) {
    return null;
  }

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Center the child
        backgroundColor: "#252525", // Set the background color for the full-width wrapper
      }}
    >
      <Header
        style={{
          width: "100%", // This ensures that the header takes the full width of its parent
          maxWidth: "1200px", // Limit the header's maximum width
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#252525",
          height: "40px",
          padding: "10px",  // Updated padding
          margin: 0,   // Updated margin
        }}
      >
        {session ? (
          <>
            {/* Right-aligned dropdown icon menu */}
            <div style={{ marginLeft: 'auto' }}> {/* This pushes the dropdown to the right */}
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
                <Avatar size={25} style={{ backgroundColor: "#f64cb7", cursor: "pointer" }}>
                  {session?.user?.name?.charAt(0)}
                </Avatar>
              </Dropdown>
            </div>
          </>
        ) : (
          <>
            Not signed in <br />
            <button
              onClick={() => {
                signIn();
              }}
            >
              Sign in
            </button>
          </>
        )}
      </Header>
    </div>
  );
}

export default NavMenu;
