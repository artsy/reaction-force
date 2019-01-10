import { Avatar, Box, Button, Flex, Serif } from "@artsy/palette"
import { FollowArtistPopoverRow_artist } from "__generated__/FollowArtistPopoverRow_artist.graphql"
import { FollowArtistPopoverRowMutation } from "__generated__/FollowArtistPopoverRowMutation.graphql"
import { ContextProps } from "Artsy"
import React from "react"
import { commitMutation, createFragmentContainer, graphql } from "react-relay"
import { RecordSourceSelectorProxy, SelectorData } from "relay-runtime"
import styled from "styled-components"
import { get } from "Utils/get"

interface Props extends ContextProps {
  artist: FollowArtistPopoverRow_artist
  suggestedIds?: ReadonlyArray<string>
}

interface State {
  swappedArtist: FollowArtistPopoverRow_artist
  followed: boolean
}

const ArtistName = styled(Serif)`
  width: 125px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
const FollowButtonContainer = Box

class FollowArtistPopoverRow extends React.Component<Props, State> {
  private excludedArtistIds: Set<string>

  state = {
    swappedArtist: null,
    followed: false,
  }

  constructor(props: Props, context: any) {
    super(props, context)
    this.excludedArtistIds = new Set(this.props.suggestedIds)
  }

  handleClick(artistID: string) {
    const { user, relay } = this.props
    if (user && user.id) {
      commitMutation<FollowArtistPopoverRowMutation>(relay.environment, {
        mutation: graphql`
          mutation FollowArtistPopoverRowMutation(
            $input: FollowArtistInput!
            $excludedArtistIds: [String]!
          ) {
            followArtist(input: $input) {
              artist {
                __id
                related {
                  suggested(
                    first: 3
                    exclude_followed_artists: true
                    exclude_artist_ids: $excludedArtistIds
                  ) {
                    edges {
                      node {
                        __id
                        ...FollowArtistPopoverRow_artist @relay(mask: false)
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: { artist_id: artistID, unfollow: false },
          excludedArtistIds: Array.from(this.excludedArtistIds),
        },
        optimisticUpdater: () => {
          this.setState({
            followed: true,
          })
        },
        updater: (store: RecordSourceSelectorProxy, data: SelectorData) => {
          const { node } = data.followArtist.artist.related.suggested.edges[0]
          this.excludedArtistIds.add(node.__id)

          // Add slight delay to make UX seem a bit nicer
          this.setState(
            {
              followed: true,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  swappedArtist: node,
                  followed: false,
                })
              }, 500)
            }
          )
        },
      })
    }
  }

  render() {
    const { artist: originalArtist } = this.props
    const { swappedArtist } = this.state
    const artist = swappedArtist || originalArtist
    if (!artist) return null

    const imageUrl = get(artist, a => a.image.cropped.url)
    const { _id: artistID } = artist
    const key = `avatar-${artistID}`
    return (
      <Flex alignItems="center" mb={1} mt={1}>
        <Avatar size="xs" src={imageUrl} key={key} />
        <ArtistName size="3t" color="black100" ml={1} mr={1}>
          {artist.name}
        </ArtistName>
        <FollowButtonContainer>
          <Button
            onClick={() => this.handleClick(artistID)}
            variant="secondaryOutline"
            size="small"
            width="70px"
          >
            {this.state.followed ? "Followed" : "Follow"}
          </Button>
        </FollowButtonContainer>
      </Flex>
    )
  }
}

export const FollowArtistPopoverRowFragmentContainer = createFragmentContainer(
  FollowArtistPopoverRow,
  graphql`
    fragment FollowArtistPopoverRow_artist on Artist {
      id
      _id
      __id
      name
      image {
        cropped(width: 45, height: 45) {
          url
        }
      }
    }
  `
)
