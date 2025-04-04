import type { Meta, StoryObj } from "@storybook/react";
import { BodyLarge, BodyMedium, BodySmall } from "./Body";

const meta: Meta = {
  title: "UI/Body",
  component: BodyLarge,
  parameters: {
    // layout: "centered",
  },
  argTypes: {
    as: {
      description: "렌더링 할 HTML Body 태그 (default: div)",
      options: [
        "div",
        "span",
        "p",
        "article",
        "section",
        "main",
        "aside",
        "nav",
        "header",
        "footer",
      ],
      control: {
        type: "select",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const englishText =
  "girlish flora flora seraphic baby twinkle florence flutter twilight hello way sunrise droplet cream melody apple adolescence flutter purity hello grapes banana flutter laptop aurora aurora cresent melody seraphic sunrise.";
const koreanText =
  "어디에서 많은 고이 하늘에는 쪽으로 너, 척 비는 척 너도 행복했던 박명의 속의 꽃밭에 사뿐히 따라 있다 가네 내가 언제나 리가 날에, 프랑시스 오신다면 새겨지는 이름자 지나고 모두가 박명의 진달래꽃 흘리우리다. 슬프게 불러 나의 그 때 듯합니다.";

export const BodyLargeEnglish: Story = {
  render: () => <BodyLarge>{englishText}</BodyLarge>,
};

export const BodyLargeKorean: Story = {
  render: () => <BodyLarge>{koreanText}</BodyLarge>,
};

export const BodyMediumEnglish: Story = {
  render: () => <BodyMedium>{englishText}</BodyMedium>,
};

export const BodyMediumKorean: Story = {
  render: () => <BodyMedium>{koreanText}</BodyMedium>,
};

export const BodySmallEnglish: Story = {
  render: () => <BodySmall>{englishText}</BodySmall>,
};

export const BodySmallKorean: Story = {
  render: () => <BodySmall>{koreanText}</BodySmall>,
};

export const BodyLargeMixedLanguage: Story = {
  render: () => <BodyLarge>{`${englishText}\n${koreanText}`}</BodyLarge>,
};

export const BodyMediumMixedTag: Story = {
  render: () => (
    <BodyMedium>
      <span className="text-hbc-red">{englishText}</span>{" "}
      <span className="text-hbc-blue">{koreanText}</span>
    </BodyMedium>
  ),
};

export const BodySmallAsPTag: Story = {
  render: () => <BodySmall as="p">{englishText}</BodySmall>,
};
