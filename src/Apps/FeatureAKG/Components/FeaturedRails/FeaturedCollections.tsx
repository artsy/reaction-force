import { FeaturedCollections_collections } from "__generated__/FeaturedCollections_collections.graphql"
import {
  FeaturedRail,
  FeaturedRailCarousel,
  RailMetadata,
} from "Apps/FeatureAKG/Components/FeaturedRails"
import { compact, find } from "lodash"
import React from "react"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"

interface FeaturedCollectionsRailProps {
  collections: FeaturedCollections_collections
  railMetadata: RailMetadata
}

const FeaturedCollectionsRail: React.FC<FeaturedCollectionsRailProps> = props => {
  const { title, subtitle, items } = props.railMetadata
  const { collections } = props

  const itemsForCarousel = collections.map(collection => {
    const matchingCollectionFromSpreadsheet = find(
      items,
      item => item.id === collection.slug
    )
    if (matchingCollectionFromSpreadsheet) {
      return {
        ...collection,
        imageSrc: matchingCollectionFromSpreadsheet.image_src,
        subtitle: "Collection",
        href: `/collection/${collection.slug}`,
      }
    } else {
      return null
    }
  })

  // This will happen if we have IDs in our spreadsheet that don't match
  // data we fetch for.
  if (compact(itemsForCarousel).length > 0) {
    return (
      <FeaturedRail title={title} subtitle={subtitle}>
        <FeaturedRailCarousel itemsForCarousel={itemsForCarousel} />
      </FeaturedRail>
    )
  } else {
    return null
  }
}

export const FeaturedCollectionsRailFragmentContainer = createFragmentContainer(
  FeaturedCollectionsRail,
  {
    collections: graphql`
      fragment FeaturedCollections_collections on MarketingCollection
        @relay(plural: true) {
        slug
        title
      }
    `,
  }
)