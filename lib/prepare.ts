import type { AppState } from "lib/types";

type PreparedAppState = {
  title: string | null;
  code: string | null;
  language: string;
  theme: string;
  fontFamily: string;
  fontSize: string;
  lineNumbers: boolean;
  padding: string;
  customColors: string[];
  colorMode: string;
  angle: number;
  grain: boolean;
  updatedAt: string;
};

export function prepare(body: Partial<AppState>): Partial<PreparedAppState> {
  let data: Partial<PreparedAppState> = {};

  if (body.title !== undefined) {
    const trimmedTitle = body.title?.trim();

    data.title = trimmedTitle !== "" ? trimmedTitle : null;
  }

  if (body.code !== undefined) {
    data.code = body.code === "" ? null : body.code;
  }

  if (body.language) {
    data.language = body.language.id;
  }

  if (body.theme) {
    data.theme = body.theme.id;
  }

  if (body.fontFamily) {
    data.fontFamily = body.fontFamily.id;
  }

  if (body.fontSize) {
    data.fontSize = body.fontSize;
  }

  if (body.lineNumbers !== undefined) {
    data.lineNumbers = body.lineNumbers;
  }

  if (body.padding) {
    data.padding = body.padding;
  }

  if (body.customColors) {
    data.customColors = body.customColors;
  }

  if (body.colorMode) {
    data.colorMode = body.colorMode;
  }

  if (body.angle) {
    data.angle = body.angle;
  }

  if (body.grain) {
    data.grain = body.grain;
  }

  if (Object.keys(data).length > 0) {
    data.updatedAt = new Date().toISOString();
  }

  return data;
}
