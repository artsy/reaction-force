import { Box, color, Flex, MenuItem, Sans } from "@artsy/palette"
import React from "react"
import { MenuLinkData, SimpleLinkData } from "../menuData"

interface DropDownSectionProps {
  section: MenuLinkData
}

export const DropDownSection: React.FC<DropDownSectionProps> = ({
  section,
}) => {
  if (!section) return null

  return (
    <>
      {section.text === "Artist Nationality & Region" ? (
        <Flex>
          <Box width={[110, 110, 110, 135, 150]} py={4} mr={[2, 2, 3, 3]}>
            <Sans size="2" mb={1}>
              {section.text}
            </Sans>
            {section.menu &&
              section.menu.links.slice(0, 8).map((menuItem: SimpleLinkData) => {
                return (
                  <MenuItem
                    key={menuItem.text}
                    px={0}
                    py={0.5}
                    href={menuItem.href}
                    textColor={color("black60")}
                    textWeight="regular"
                    fontSize="3t"
                  >
                    {menuItem.text}
                  </MenuItem>
                )
              })}
          </Box>
          <Box
            width={[110, 110, 110, 135, 150]}
            pt="66px"
            pb={4}
            mr={[2, 2, 3, 3]}
          >
            {section.menu &&
              section.menu.links.slice(-8).map((menuItem: SimpleLinkData) => {
                return (
                  <MenuItem
                    key={menuItem.text}
                    px={0}
                    py={0.5}
                    href={menuItem.href}
                    textColor={color("black60")}
                    textWeight="regular"
                    fontSize="3t"
                  >
                    {menuItem.text}
                  </MenuItem>
                )
              })}
          </Box>
        </Flex>
      ) : (
        <Box width={[110, 110, 110, 135, 150]} py={4} mr={[2, 2, 3, 3]}>
          <Sans size="2" mb={1}>
            {section.text}
          </Sans>
          {section.menu &&
            section.menu.links.map((menuItem: SimpleLinkData) => {
              return (
                <MenuItem
                  key={menuItem.text}
                  px={0}
                  py={0.5}
                  href={menuItem.href}
                  textColor={color("black60")}
                  textWeight="regular"
                  fontSize="3t"
                >
                  {menuItem.text}
                </MenuItem>
              )
            })}
        </Box>
      )}
    </>
  )
}
