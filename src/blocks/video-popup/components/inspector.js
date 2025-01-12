/**
 * WordPress dependencies
 */
// Setup the block
const { __ } = wp.i18n;
const { select } = wp.data;
const { Component, Fragment } = wp.element;
const {
  InspectorControls,
  PanelColorSettings,
  RichText,
  AlignmentToolbar,
  BlockControls,
  MediaUpload,
  ColorPalette,
} = wp.editor;

const {
  PanelBody,
  RangeControl,
  ToggleControl,
  SelectControl,
  TextControl,
  BaseControl,
  Icon,
  Button,
  TabPanel,
  Dashicon,
} = wp.components;

import {
  showOptions,
  getVideoProviderFromURL,
  urlIsVideo,
  ImageControl,
} from "../util/index.js";

import BoxShadowControl from "../../../utils/components/box-shadow";

/**
 * Inspector controls
 */
export default class Inspector extends Component {
  constructor(props) {
    super(...arguments);
  }

  render() {
    const { attributes, isSelected, setAttributes } = this.props;

    const {
      borderRadius = "",
      shadow = "",
      videoLink = "",
      videoID = "",
      width = "",
      showBlockTitle = false,
      showBlockDescription = false,
      playButtonType,
      playButtonColor = "#ffffff",
      playButtonSize,
      vidwidth,
      vidwidthTablet,
      vidwidthMobile,
      vidheight,
      vidheightTablet,
      vidheightMobile,
      vidBackgroundColor,
      opacity,
      imgURL,
      imgID,
      butopacity,
      blockBorderStyle,
      blockBorderWidth,
      blockBorderRadius,
      blockBorderColor,
      boxShadowColor,
      boxShadowHOffset,
      boxShadowVOffset,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowPosition,
    } = attributes;

    // Change the image
    const onSelectImage = (img) => {
      setAttributes({
        imgID: img.id,
        imgURL: img.url,
        imgAlt: img.alt,
      });
    };

    // Clear the image
    const onRemoveImage = () => {
      setAttributes({
        imgID: null,
        imgURL: null,
        imgAlt: null,
      });
    };

    // Update color values
    const onChangeBackgroundColor = (value) =>
      setAttributes({ vidBackgroundColor: value });

    const urlIsVideo = (url) => url.match(/(mp4|webm|ogg)$/i);

    /**
     * From a URL, get the video ID and provider: YouTube or Vimeo.
     *
     * @param {string} url
     *
     * @return {Object} An object containing the video ID and provider name.
     */
    const getVideoProviderFromURL = (url) => {
      let id = "";

      // Check for YouTube.
      id = (url.match(/youtube\.com\/watch\?v=([^\&\?\/]+)/i) || [])[1];

      if (!id) {
        id = (url.match(/youtube\.com\/embed\/([^\&\?\/]+)/i) || [])[1];
      }
      if (!id) {
        id = (url.match(/youtube\.com\/v\/([^\&\?\/]+)/i) || [])[1];
      }
      if (!id) {
        id = (url.match(/youtu\.be\/([^\&\?\/]+)/i) || [])[1];
      }

      if (id) {
        return {
          type: "youtube",
          id,
        };
      }

      // Check for Vimeo.
      id = (url.match(/vimeo\.com\/(\w*\/)*(\d+)/i) || [])[2];
      if (!id) {
        id = (url.match(/^\d+$/i) || [])[0];
      }

      if (id) {
        return {
          type: "vimeo",
          id,
        };
      }

      return {
        type: "youtube",
        id: url,
      };
    };

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody
            title={__("Popup Options", "responsive-block-editor-addons")}
            initialOpen={true}
          >
            <ImageControl
              label={__("Upload Video", "responsive-block-editor-addons")}
              help={__(
                "Use .mp4 format for videos",
                "responsive-block-editor-addons"
              )}
              onRemove={() =>
                setAttributes({
                  videoLink: "",
                  videoID: "",
                })
              }
              onChange={(media) => {
                setAttributes({
                  videoLink: media.url,
                  videoID: media.url,
                });
              }}
              imageID={urlIsVideo(videoLink) ? videoID : ""}
              imageURL={urlIsVideo(videoLink) ? videoLink : ""}
              allowedTypes={["video"]}
            />
            <TextControl
              label={__("Video URL", "responsive-block-editor-addons")}
              help={__(
                "Paste a Youtube / Vimeo URL",
                "responsive-block-editor-addons"
              )}
              placeholder={__("https://", "responsive-block-editor-addons")}
              value={!urlIsVideo(videoLink) ? videoLink : ""}
              onChange={(videoLink) =>
                setAttributes({
                  videoLink,
                  videoID: getVideoProviderFromURL(videoLink).id,
                })
              }
              min={1}
              max={4}
            />
          </PanelBody>
          <PanelBody
            title={__("Container", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <TabPanel
              className=" responsive-size-type-field-tabs  responsive-size-type-field__common-tabs  responsive-inline-margin"
              activeClass="active-tab"
              tabs={[
                {
                  name: "desktop",
                  title: <Dashicon icon="desktop" />,
                  className:
                    " responsive-desktop-tab  responsive-responsive-tabs",
                },
                {
                  name: "tablet",
                  title: <Dashicon icon="tablet" />,
                  className:
                    " responsive-tablet-tab  responsive-responsive-tabs",
                },
                {
                  name: "mobile",
                  title: <Dashicon icon="smartphone" />,
                  className:
                    " responsive-mobile-tab  responsive-responsive-tabs",
                },
              ]}
            >
              {(tab) => {
                let tabout;

                if ("mobile" === tab.name) {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Width Mobile",
                          "responsive-block-editor-addons"
                        )}
                        value={vidwidthMobile}
                        onChange={(value) =>
                          setAttributes({ vidwidthMobile: value })
                        }
                        min={200}
                        max={2000}
                      />
                    </Fragment>
                  );
                } else if ("tablet" === tab.name) {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Width Tablet",
                          "responsive-block-editor-addons"
                        )}
                        value={vidwidthTablet}
                        onChange={(value) =>
                          setAttributes({ vidwidthTablet: value })
                        }
                        min={200}
                        max={2000}
                      />
                    </Fragment>
                  );
                } else {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__("Width", "responsive-block-editor-addons")}
                        value={vidwidth}
                        onChange={(value) => setAttributes({ vidwidth: value })}
                        min={200}
                        max={2000}
                      />
                    </Fragment>
                  );
                }

                return <div>{tabout}</div>;
              }}
            </TabPanel>
            <TabPanel
              className=" responsive-size-type-field-tabs  responsive-size-type-field__common-tabs  responsive-inline-margin"
              activeClass="active-tab"
              tabs={[
                {
                  name: "desktop",
                  title: <Dashicon icon="desktop" />,
                  className:
                    " responsive-desktop-tab  responsive-responsive-tabs",
                },
                {
                  name: "tablet",
                  title: <Dashicon icon="tablet" />,
                  className:
                    " responsive-tablet-tab  responsive-responsive-tabs",
                },
                {
                  name: "mobile",
                  title: <Dashicon icon="smartphone" />,
                  className:
                    " responsive-mobile-tab  responsive-responsive-tabs",
                },
              ]}
            >
              {(tab) => {
                let tabout;

                if ("mobile" === tab.name) {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Height Mobile",
                          "responsive-block-editor-addons"
                        )}
                        value={vidheightMobile}
                        onChange={(value) =>
                          setAttributes({ vidheightMobile: value })
                        }
                        min={300}
                        max={700}
                      />
                    </Fragment>
                  );
                } else if ("tablet" === tab.name) {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Height Tablet",
                          "responsive-block-editor-addons"
                        )}
                        value={vidheightTablet}
                        onChange={(value) =>
                          setAttributes({ vidheightTablet: value })
                        }
                        min={300}
                        max={700}
                      />
                    </Fragment>
                  );
                } else {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__("Height", "responsive-block-editor-addons")}
                        value={vidheight}
                        onChange={(value) =>
                          setAttributes({ vidheight: value })
                        }
                        min={300}
                        max={700}
                      />
                    </Fragment>
                  );
                }

                return <div>{tabout}</div>;
              }}
            </TabPanel>
          </PanelBody>
          <PanelBody
            title={__("Background Options", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <p>
              {__(
                "Select a background image:",
                "responsive-block-editor-addons"
              )}
            </p>
            <MediaUpload
              onSelect={onSelectImage}
              type="image"
              value={imgID}
              render={({ open }) => (
                <div>
                  <Button
                    className="responsive-block-editor-addons-cta-inspector-media"
                    label={__("Edit image", "responsive-block-editor-addons")}
                    onClick={open}
                  >
                    <Icon icon="format-image" />
                    {__("Select Image", "responsive-block-editor-addons")}
                  </Button>

                  {imgURL && !!imgURL.length && (
                    <Button
                      className="responsive-block-editor-addons-cta-inspector-media"
                      label={__(
                        "Remove Image",
                        "responsive-block-editor-addons"
                      )}
                      onClick={onRemoveImage}
                    >
                      <Icon icon="dismiss" />
                      {__("Remove", "responsive-block-editor-addons")}
                    </Button>
                  )}
                </div>
              )}
            ></MediaUpload>
            <PanelColorSettings
              title={__("Overlay Color", "responsive-block-editor-addons")}
              initialOpen={false}
              colorSettings={[
                {
                  value: vidBackgroundColor,
                  onChange: onChangeBackgroundColor,
                  label: __("", "responsive-block-editor-addons"),
                },
              ]}
            >
              <RangeControl
                label={__("Opacity", "responsive-block-editor-addons")}
                value={opacity}
                onChange={(value) =>
                  setAttributes({ opacity: value !== undefined ? value : 50 })
                }
                min={0}
                max={100}
                allowReset
              />
            </PanelColorSettings>
          </PanelBody>
          <PanelBody
            title={__("Play Button", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <SelectControl
              label={__("Style")}
              value={playButtonType}
              onChange={(value) => setAttributes({ playButtonType: value })}
              options={[
                {
                  value: "normal",
                  label: __(
                    "Normal Play Button",
                    "responsive-block-editor-addons"
                  ),
                },
                {
                  value: "circle",
                  label: __(
                    "Play Button with Circle",
                    "responsive-block-editor-addons"
                  ),
                },
                {
                  value: "outline",
                  label: __(
                    "Outline Play Button",
                    "responsive-block-editor-addons"
                  ),
                },
                {
                  value: "video",
                  label: __(
                    "Video Play Button",
                    "responsive-block-editor-addons"
                  ),
                },
              ]}
            />
            <RangeControl
              label={__("Size", "responsive-block-editor-addons")}
              value={playButtonSize}
              onChange={(value) =>
                setAttributes({
                  playButtonSize: value !== undefined ? value : 30,
                })
              }
              min={0}
              max={500}
              allowReset
            />
            <p className="responsive-block-editor-addons-setting-label">
              {__("Color", "responsive-block-editor-addons")}
              <span className="components-base-control__label">
                <span
                  className="component-color-indicator"
                  style={{ backgroundColor: playButtonColor }}
                ></span>
              </span>
            </p>
            <ColorPalette
              value={playButtonColor}
              onChange={(value) => setAttributes({ playButtonColor: value })}
              allowReset
            />
            <RangeControl
              label={__("Opacity", "responsive-block-editor-addons")}
              value={butopacity}
              onChange={(value) =>
                setAttributes({ butopacity: value !== undefined ? value : 100 })
              }
              min={0}
              max={100}
              allowReset
            />
          </PanelBody>
          <PanelBody
            title={__("Border", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <SelectControl
              label={__("Border Style")}
              value={blockBorderStyle}
              onChange={(value) => setAttributes({ blockBorderStyle: value })}
              options={[
                { value: "none", label: __("None") },
                { value: "solid", label: __("Solid") },
                { value: "dotted", label: __("Dotted") },
                { value: "dashed", label: __("Dashed") },
                { value: "double", label: __("Double") },
                { value: "groove", label: __("Groove") },
                { value: "inset", label: __("Inset") },
                { value: "outset", label: __("Outset") },
                { value: "ridge", label: __("Ridge") },
              ]}
            />
            {"none" != blockBorderStyle && (
              <RangeControl
                label={__("Border Width")}
                value={blockBorderWidth}
                onChange={(value) => setAttributes({ blockBorderWidth: value })}
                min={0}
                max={50}
              />
            )}
            <RangeControl
              label={__("Border Radius")}
              value={blockBorderRadius}
              onChange={(value) => setAttributes({ blockBorderRadius: value })}
              min={0}
              max={1000}
            />
            {"none" != blockBorderStyle && (
              <Fragment>
                <p className="responsive-setting-label">
                  {__("Border Color")}
                  <span className="components-base-control__label">
                    <span
                      className="component-color-indicator"
                      style={{ backgroundColor: blockBorderColor }}
                    ></span>
                  </span>
                </p>
                <ColorPalette
                  value={blockBorderColor}
                  onChange={(colorValue) =>
                    setAttributes({ blockBorderColor: colorValue })
                  }
                  allowReset
                />
              </Fragment>
            )}
            <BoxShadowControl
              setAttributes={setAttributes}
              label={__("Box Shadow")}
              boxShadowColor={{ value: boxShadowColor, label: __("Color") }}
              boxShadowHOffset={{
                value: boxShadowHOffset,
                label: __("Horizontal"),
              }}
              boxShadowVOffset={{
                value: boxShadowVOffset,
                label: __("Vertical"),
              }}
              boxShadowBlur={{ value: boxShadowBlur, label: __("Blur") }}
              boxShadowSpread={{ value: boxShadowSpread, label: __("Spread") }}
              boxShadowPosition={{
                value: boxShadowPosition,
                label: __("Position"),
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  }
}
