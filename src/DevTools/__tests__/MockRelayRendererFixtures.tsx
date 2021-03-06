import { MockRelayRendererFixtures_artist } from "__generated__/MockRelayRendererFixtures_artist.graphql"
import { MockRelayRendererFixtures_artwork } from "__generated__/MockRelayRendererFixtures_artwork.graphql"
import { MockRelayRendererFixtures_artworkMetadata } from "__generated__/MockRelayRendererFixtures_artworkMetadata.graphql"
import { MockRelayRendererFixturesArtistQuery } from "__generated__/MockRelayRendererFixturesArtistQuery.graphql"
import { SystemContextConsumer } from "Artsy"
import { renderWithLoadProgress } from "Artsy/Relay/renderWithLoadProgress"
import { SystemQueryRenderer as QueryRenderer } from "Artsy/Relay/SystemQueryRenderer"
import cheerio from "cheerio"
import { render } from "enzyme"
import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

const Metadata = createFragmentContainer(
  (props: { artworkMetadata: MockRelayRendererFixtures_artworkMetadata }) => (
    <div>{props.artworkMetadata.title}</div>
  ),
  {
    artworkMetadata: graphql`
      fragment MockRelayRendererFixtures_artworkMetadata on Artwork {
        title
      }
    `,
  }
)

export const Artwork = createFragmentContainer(
  (props: { artwork: MockRelayRendererFixtures_artwork }) => (
    <div>
      <img src={props.artwork.image.url} />
      <Metadata artworkMetadata={props.artwork} />
      {props.artwork.artist && (
        <ArtistQueryRenderer id={props.artwork.artist.slug} />
      )}
    </div>
  ),
  {
    artwork: graphql`
      fragment MockRelayRendererFixtures_artwork on Artwork {
        image {
          url
        }
        artist {
          slug
        }
        ...MockRelayRendererFixtures_artworkMetadata
      }
    `,
  }
)

const Artist = createFragmentContainer(
  (props: { artist: MockRelayRendererFixtures_artist }) => (
    <div>{props.artist.name}</div>
  ),
  {
    artist: graphql`
      fragment MockRelayRendererFixtures_artist on Artist {
        name
      }
    `,
  }
)

const ArtistQueryRenderer = (props: { id: string }) => (
  <SystemContextConsumer>
    {({ relayEnvironment }) => {
      return (
        <QueryRenderer<MockRelayRendererFixturesArtistQuery>
          // @ts-ignore
          environment={relayEnvironment}
          variables={props}
          query={graphql`
            query MockRelayRendererFixturesArtistQuery($id: String!)
              @raw_response_type {
              artist(id: $id) {
                ...MockRelayRendererFixtures_artist
              }
            }
          `}
          render={renderWithLoadProgress(Artist)}
        />
      )
    }}
  </SystemContextConsumer>
)

export const query = graphql`
  query MockRelayRendererFixturesQuery @raw_response_type {
    artwork(id: "mona-lisa") {
      ...MockRelayRendererFixtures_artwork
    }
  }
`

// Bad query has a misnamed top-level property.
export const badQuery = graphql`
  query MockRelayRendererFixturesBadQuery @raw_response_type {
    something_that_is_not_expected: artwork(id: "mona-lisa") {
      ...MockRelayRendererFixtures_artwork
    }
  }
`

export function renderToString(element: JSX.Element) {
  return cheerio.html(render(element))
}
