import { RelatedPanel } from "Components/Publishing/Fixtures/Components"
import { mount } from "enzyme"
import "jest-styled-components"
import React from "react"
import { RelatedArticlesPanelLink } from "../RelatedArticlesPanelLink"

jest.unmock("react-tracking")

describe("RelatedArticlesPanelLink", () => {
  const getWrapper = props => {
    return mount(<RelatedArticlesPanelLink {...props} />)
  }

  let testProps
  beforeEach(() => {
    testProps = { article: RelatedPanel[0] }
  })

  it("renders expected data", () => {
    const component = getWrapper(testProps)

    expect(component.text()).toMatch(
      "The 15 Top Art Schools in the United States"
    )
    expect(component.html()).toMatch("PoetterHall_Exterior%2Bcopy.jpg")
  })
})
