import { BarBox, QuestionCircleIcon } from "@artsy/palette"
import { renderRelayTree } from "DevTools"
import React from "react"
import { graphql } from "react-relay"
import { PricingContextFragmentContainer } from "../PricingContext"

jest.unmock("react-relay")

const mockPricingContext = {
  filterDescription: `small mocks by David Sheldrick`,
  bins: [
    {
      maxPrice: "$88",
      maxPriceCents: 8855,
      minPrice: null,
      minPriceCents: 900,
      numArtworks: 67,
    },
    {
      maxPrice: "$168",
      maxPriceCents: 16810,
      minPrice: "$88",
      minPriceCents: 8855,
      numArtworks: 1,
    },
    {
      maxPrice: "$247",
      maxPriceCents: 24765,
      minPrice: "$168",
      minPriceCents: 16810,
      numArtworks: 0,
    },
    {
      maxPrice: "$327",
      maxPriceCents: 32720,
      minPrice: "$247",
      minPriceCents: 24765,
      numArtworks: 17,
    },
  ],
}

const mockArtwork = {
  artists: [{ id: "artist-id" }],
  widthCm: 234,
  heightCm: 234,
  category: "Photography",
  pricingContext: mockPricingContext,
  priceCents: {
    min: 23455,
    max: null,
  },
}

describe("PricingContext", () => {
  let enablePricingContext = true
  beforeEach(() => {
    enablePricingContext = true
  })
  function getWrapper(
    mockData: any = {
      artwork: {
        ...mockArtwork,
      },
    }
  ) {
    return renderRelayTree({
      Component: (props: any) => (
        <div>
          <PricingContextFragmentContainer {...props} />
        </div>
      ),
      mockData,
      query: graphql`
        query PricingContextTestQuery($enablePricingContext: Boolean!) {
          artwork(id: "unused") {
            ...PricingContext_artwork
          }
        }
      `,
      variables: {
        enablePricingContext,
      },
    })
  }

  it("renders if there is data present", async () => {
    const wrapper = await getWrapper()
    expect(wrapper.text()).toContain("Price in context")
    expect(wrapper.text()).toContain(
      "Price ranges of small mocks by David Sheldrick"
    )
  })

  it("renders as null if no data present", async () => {
    const wrapper = await getWrapper({
      artwork: {
        ...mockArtwork,
        pricingContext: null,
      },
    })
    expect(wrapper.text()).not.toContain(
      "Price ranges of small mocks by David Sheldrick"
    )
  })

  it("renders pricing context question mark icon and informational modal", async () => {
    const wrapper = await getWrapper()
    expect(wrapper.find(QuestionCircleIcon).length).toEqual(1)
    wrapper
      .find(QuestionCircleIcon)
      .at(0)
      .simulate("click")
    expect(wrapper.text()).toContain(
      "This feature aims to provide insight into the range of prices for an artist's works and allow buyers to discover other available works by the artist at different price points."
    )
  })

  it("renders as null if enablePricingContext is false", async () => {
    enablePricingContext = false
    const wrapper = await getWrapper()
    expect(wrapper.text()).not.toContain(
      "Price ranges of small mocks by David Sheldrick"
    )
  })

  it("displays $0 as the minimum price label if the minimum price is null", async () => {
    const wrapper = await getWrapper()
    expect(wrapper.text()).not.toContain("null")
    expect(wrapper.text()).toContain("$0")
  })

  it("displays '1 work' not '0 works' in highlight label if there are zero artworks for the highlighted bin", async () => {
    const wrapper = await getWrapper()
    const highlightedBar = wrapper.find(BarBox).at(2)

    highlightedBar.simulate("mouseenter")
    expect(wrapper.text()).not.toContain("0 works")
    expect(wrapper.text()).toContain("1 work")
  })

  it("displays 'work' singular not 'works' plural in label when there is only 1 artwork in a bin", async () => {
    const wrapper = await getWrapper()
    const secondBar = wrapper.find(BarBox).at(1)

    secondBar.simulate("mouseenter")
    expect(wrapper.text()).not.toContain("1 works")
    expect(wrapper.text()).toContain("1 work")
  })

  it("uses the mean of min+max when list price is a range", async () => {
    const wrapper = await getWrapper({
      artwork: {
        ...mockArtwork,
        priceCents: {
          min: 15500,
          max: 25500,
        },
      },
    })

    expect(wrapper.find("HighlightLabel").text()).toMatchInlineSnapshot(
      `"$168–$247This work"`
    )
  })
})
