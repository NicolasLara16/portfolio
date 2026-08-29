import type { IconType } from "react-icons";
import {
  SiClaude,
  SiDatabricks,
  SiDocker,
  SiGit,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiLooker,
  SiN8N,
  SiPandas,
  SiPython,
} from "react-icons/si";
import {
  TbBrandCss3,
  TbBrandOpenai,
  TbChartDonut,
  TbChartHistogram,
  TbChartLine,
  TbCode,
  TbSql,
  TbTerminal2,
  TbWand,
} from "react-icons/tb";

export const SKILL_ICONS: Record<string, IconType> = {
  SQL: TbSql,
  Python: SiPython,
  HTML5: SiHtml5,
  CSS3: TbBrandCss3,
  JavaScript: SiJavascript,
  Pandas: SiPandas,
  Matplotlib: TbChartLine,
  Databricks: SiDatabricks,
  n8n: SiN8N,
  "Power BI": TbChartHistogram,
  "Looker Studio": SiLooker,
  Tableau: TbChartDonut,
  Gemini: SiGooglegemini,
  GPT: TbBrandOpenai,
  Claude: SiClaude,
  OpenCode: TbTerminal2,
  "Engenharia de Prompts": TbWand,
  Docker: SiDocker,
  "Git/GitHub": SiGit,
  "Linux/OS": SiLinux,
};

export const ICON_OPTIONS = Object.keys(SKILL_ICONS);

export function getSkillIcon(iconKey: string): IconType {
  return SKILL_ICONS[iconKey] ?? TbCode;
}
