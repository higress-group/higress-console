/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.console.service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.concurrent.TimeUnit;

final class MutableClock extends Clock {

    private long millis;
    private final ZoneId zone;

    MutableClock(long millis) {
        this(millis, ZoneOffset.UTC);
    }

    private MutableClock(long millis, ZoneId zone) {
        this.millis = millis;
        this.zone = zone;
    }

    void advanceMillis(long millis) {
        this.millis += millis;
    }

    void advance(Duration duration) {
        advanceMillis(duration.toMillis());
    }

    void advanceSeconds(long seconds) {
        advanceMillis(TimeUnit.SECONDS.toMillis(seconds));
    }

    @Override
    public ZoneId getZone() {
        return zone;
    }

    @Override
    public Clock withZone(ZoneId zone) {
        return new MutableClock(millis, zone);
    }

    @Override
    public Instant instant() {
        return Instant.ofEpochMilli(millis);
    }

    @Override
    public long millis() {
        return millis;
    }
}
